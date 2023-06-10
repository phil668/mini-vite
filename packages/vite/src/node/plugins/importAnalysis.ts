import path from 'node:path'
import { init, parse } from 'es-module-lexer'
import MagicString from 'magic-string'
import createDebug from 'debug'
import type { Plugin } from '../plugin'
import { isJsRequest, normalizePath } from '../util'
import { BARE_IMPORT_RE, PRE_BUNDLE_DIR } from '../constant'

const debug = createDebug('importPlugin')

function importAnalysisPlugin(): Plugin {
  return {
    name: 'pvite:import-analysis',
    async transform(code, id) {
      if (!isJsRequest(id))
        return null
      await init
      const [imports] = parse(code)
      const ms = new MagicString(code)
      for (const importItem of imports) {
        const { s: modeStart, e: modEnd, n: modSource } = importItem
        console.log({ modeStart, modSource, modEnd })
        // 如果是裸模块导入,需要替换成预购建产物的路径
        if (modSource && BARE_IMPORT_RE.test(modSource)) {
          const bundlePath = normalizePath(path.join('/', PRE_BUNDLE_DIR, `${modSource}.js`))
          //   console.log('bundlePath', bundlePath)
          ms.overwrite(modeStart, modEnd, bundlePath)
        //   如果以.和/开头说明是相对路径,而不是npm模块,将读取的code内的路径替换成真实的文件地址
        }
        else if (modSource?.startsWith('.') || modSource?.startsWith('/')) {
          if (!this.resolve)
            continue
          const resolveId = await this.resolve(modSource, id)
          let idStr = ''
          if (resolveId)
            idStr = resolveId.id
          debug('resolveId:% ', resolveId)
          ms.overwrite(modeStart, modEnd, idStr)
        }
      }
      return {
        code: ms.toString(),
        map: ms.generateMap(),
      }
    },
  }
}

export { importAnalysisPlugin }
