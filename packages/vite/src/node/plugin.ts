import type { LoadResult, PartialResolvedId, SourceDescription } from 'rollup'
import type { ServerContext } from './server/index'
import { resolvePlugin } from './plugins/resolve'

// export type ServerHook = (server: ServerContext) => (void)
export type ServerHook = (
  server: ServerContext
) => (() => void) | void | Promise<(() => void) | void>

export interface Plugin {
  name: string
  configureServer?: ServerHook
  resolveId?: (
    id: string,
    importer?: string
  ) => Promise<PartialResolvedId | null> | PartialResolvedId | null
  load?: (id: string) => Promise<LoadResult | null> | LoadResult | null
  transform?: (
    code: string,
    id: string
  ) => Promise<SourceDescription | null> | SourceDescription | null
  transformIndexHtml?: (raw: string) => Promise<string> | string
}

export function resolvePlugins() {
  const plugin: Plugin = {
    name: 'test:plugin',
    resolveId(id) {
      return { id }
    },
    transformIndexHtml(raw) {
      return raw
    },
  }
  return [plugin, resolvePlugin(), plugin]
}
