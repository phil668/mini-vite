/* eslint-disable @typescript-eslint/no-require-imports */
import path from 'node:path'
import type { Loader, Plugin } from 'esbuild'
import { sync } from 'resolve'
import { init, parse } from 'es-module-lexer'
import { readFile } from 'fs-extra'
import createDebug from 'debug'
import { BARE_IMPORT_RE } from '../constant'
import { normalizePath } from '../util'

const debug = createDebug('dev')

/**
 * 插件的作用: 将bareImport转换为真实的文件路径
 * 通过resolve库的sync方法 获取到真实的路径
 * 拿到路径后读取文件内容 获取入口文件的导出有哪些
 * 构建一个代理模块 ,将esm和cjs两种导出统一转换为esm风格的导出
 * 对于cjs 需要通过require方法先获取其导出的对象 再统一导出 注意这里不能直接export default
 * 因为后续开发者在使用该模块时 会被vite转换为预购建的模块 需要保持原来的按需导入
 * @param deps
 * @returns
 */
function preBundlePlugin(deps: Set<string>): Plugin {
  return {
    name: 'esbuild:pre-bundle',
    setup(build) {
      build.onResolve({
        filter: BARE_IMPORT_RE,
      }, (resolveInfo) => {
        const { path: id, importer } = resolveInfo
        const isEntry = !importer
        if (deps.has(id)) {
          console.log('id', { id, isEntry })
          return isEntry
            ? {
                path: id,
                namespace: 'dep',
              }
            : {
                path: sync(id, { basedir: process.cwd() }),
              }
        }
      })
      // 拿到标记后的模块(dep) 构造代理模块进行打包
      build.onLoad({
        filter: /.*/,
        namespace: 'dep',
      }, async (loadInfo) => {
        await init
        const id = loadInfo.path
        const root = process.cwd()
        // 利用resolve库的sync 从npm包名解析出他在node_modules中的真实路径
        const entryPath = normalizePath(sync(id, { basedir: root }))
        // 根据路径读取对应文件的内容
        const code = await readFile(entryPath, { encoding: 'utf-8' })
        const [importItems, exportItems] = parse(code)
        // console.log('entryPath', blue(entryPath), { importItems, exportItems })
        // 代理模块
        const proxyModule = []
        // 如果有import和export被parse出来,说明是esm
        if (importItems.length && exportItems.length) {
          // 如果有默认导出 需要先导入默认的模块 再export default出去
          if (exportItems.find(v => v.n.includes('default')))
            proxyModule.push(`import d from "${entryPath}";\n export default d`)
            // 将入口文件所有的导出统一export出去
          proxyModule.push(`export * from "${entryPath}"`)
        }
        else {
          // 如果是cjs模块
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-var-requires
          const res = require(entryPath)
          const specifiers = Object.keys(res)
          proxyModule.push(`export { ${specifiers.join(',')} } from "${entryPath}"`,
              `export default require("${entryPath}")`)
        }
        debug('proxy module: %o', proxyModule.join('\n'))
        // 通过文件名后缀获取对应的loader
        const loader = path.extname(entryPath).slice(1)
        return {
          loader: loader as Loader,
          contents: proxyModule.join('\n'),
          resolveDir: root,
        }
      })
    },
  }
}

export { preBundlePlugin }
