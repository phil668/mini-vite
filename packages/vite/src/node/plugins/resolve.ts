import path from 'node:path'
import { pathExists } from 'fs-extra'
import { normalizePath } from 'vite'
import resolve from 'resolve'
import type { Plugin } from '../plugin'
import type { ServerContext } from '../server'
import { DEFAULT_EXTENSION } from '../constant'

function resolvePlugin(): Plugin {
  let serverContext: ServerContext
  return {
    name: 'pvite:resolve',
    configureServer(s) {
      serverContext = s
    },
    async resolveId(id, importer) {
      // 1绝对路径
      if (path.isAbsolute(id)) {
        if (await pathExists(id))
          return { id }
        id = path.join(serverContext.root)
        if (await pathExists(id))
          console.log('id123', id)
        return { id }
      }
      else if (id.startsWith('.')) {
        if (!importer)
          throw new Error('importer should not be undefined')
        const hasExtension = path.extname(id).length > 1
        let entryId
        if (hasExtension) {
          entryId = normalizePath(resolve.sync(id, { basedir: path.dirname(importer) }))
          if (entryId && await pathExists(entryId))
            return { id: entryId }
        }
        else {
          for (const extName of DEFAULT_EXTENSION) {
            try {
              // 拼接完整的路径
              const withExtanme = `${id}${extName}`
              entryId = normalizePath(resolve.sync(withExtanme, { basedir: path.dirname(importer) }))
              if (await pathExists(entryId))
                return { id: entryId }
            }
            catch (error) {
              continue
            }
          }
        }
      }
      return null
    },
  }
}

export { resolvePlugin }
