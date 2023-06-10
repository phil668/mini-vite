import type { LoadResult, PartialResolvedId, PluginContext, SourceDescription } from 'rollup'
import type { ServerContext } from './server/index'
import { resolvePlugin } from './plugins/resolve'
import { esbuildTransformPlugin } from './plugins/esbuild'
import { importAnalysisPlugin } from './plugins/importAnalysis'

// export type ServerHook = (server: ServerContext) => (void)
export type ServerHook = (
  server: ServerContext
) => (() => void) | void | Promise<(() => void) | void>

export interface Plugin {
  name: string
  configureServer?: ServerHook
  resolveId?: (
    this: PluginContext,
    id: string,
    importer?: string
  ) => Promise<PartialResolvedId | null> | PartialResolvedId | null
  load?: (this: PluginContext, id: string) => Promise<LoadResult | null> | LoadResult | null
  transform?: (
    this: PluginContext,
    code: string,
    id: string
  ) => Promise<SourceDescription | null> | SourceDescription | null
  transformIndexHtml?: (raw: string) => Promise<string> | string
}

export function resolvePlugins() {
  return [resolvePlugin(), esbuildTransformPlugin(), importAnalysisPlugin()]
}
