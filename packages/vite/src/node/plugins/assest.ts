import { normalizePath } from 'vite'
import type { Plugin } from '../plugin'
import { cleanURL, getShortName, removeImportQuery } from '../util'
import type { ServerContext } from '../server'

function assestPlugin(): Plugin {
  let serverContext: ServerContext
  return {
    name: 'pvite:assest',
    configureServer(s) {
      serverContext = s
    },
    load(id) {
      const cleanId = removeImportQuery(cleanURL(id))
      const resolveId = `/${getShortName(normalizePath(cleanId), serverContext.root)}`
      console.log('resolveId', resolveId)
      if (resolveId.endsWith('.svg')) {
        const code = `export default "${resolveId}"`
        return {
          code,
        }
      }
    },
  }
}

export { assestPlugin }
