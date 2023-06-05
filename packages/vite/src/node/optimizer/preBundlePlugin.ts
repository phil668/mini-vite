import type { Plugin } from 'esbuild'
import { sync } from 'resolve'
import { init, parse } from 'es-module-lexer'
import { readFile } from 'fs-extra'
import { blue } from 'picocolors'
import { BARE_IMPORT_RE } from '../constant'
import { normalizePath } from '../util'

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
        console.log('entryPath', blue(entryPath), { importItems, exportItems })
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

        return {
          contents: '',
        }
      })
    },
  }
}

export { preBundlePlugin }
