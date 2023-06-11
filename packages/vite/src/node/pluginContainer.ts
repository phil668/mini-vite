import type {
  LoadResult,
  PartialResolvedId,
  PluginContext,
  ResolvedId,
  SourceDescription,
} from 'rollup'
import type { Plugin } from './plugin'

export interface PluginContainer {
  resolveId(id: string, importer?: string): Promise<PartialResolvedId | null>
  load(id: string): Promise<LoadResult | null>
  transform(code: string, id: string): Promise<SourceDescription | null | string>
}

export function createPluginContainer(plugins: Plugin[]): PluginContainer {
  const pluginContainer: PluginContainer = {
    async resolveId(id: string, importer?: string) {
      const ctx = new Context()
      for (const plugin of plugins) {
        if (plugin.resolveId) {
          const out = await plugin.resolveId.call(ctx as PluginContext, id, importer)
          if (out) {
            id = typeof out === 'string' ? out : out.id
            return { id }
          }
        }
      }
      return null
    },
    async load(id: string) {
      const ctx = new Context()
      for (const plugin of plugins) {
        console.log('plugin', id, plugin)

        if (plugin.load) {
          const result = await plugin.load.call(ctx as PluginContext, id)
          if (result)
            return result
        }
      }
    },
    async transform(code: string, id: string) {
      const ctx = new Context()
      for (const plugin of plugins) {
        if (plugin.transform) {
          const result = await plugin.transform.call(ctx as PluginContext, code, id)
          if (!result)
            continue

          if (typeof result === 'string')
            code = result

          else
            code = result.code
        }
      }
      return { code }
    },
  }

  // @ts-expect-error
  class Context implements PluginContext {
    async resolve(id: string, importer?: string) {
      let out = await pluginContainer.resolveId(id, importer)
      if (typeof out === 'string')
        out = { id: out }
      return out as ResolvedId | null
    }
  }

  return pluginContainer
}
