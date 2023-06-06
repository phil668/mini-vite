import connect from 'connect'
import { blue, green } from 'picocolors'
import { optimize } from '../optimizer/index'
import type { Plugin } from '../plugin'
import { resolvePlugins } from '../plugin'
import type { PluginContainer } from '../pluginContainer'
import { createPluginContainer } from '../pluginContainer'

export interface ServerContext {
  root: string
  pluginContainer: PluginContainer
  plugins: Plugin[]
  app: connect.Server
}

function startDevServer() {
  const app = connect()
  const root = process.cwd()
  const startTIme = Date.now()

  const plugins: Plugin[] = resolvePlugins()
  const pluginContainer = createPluginContainer(plugins)

  const serverContext: ServerContext = {
    root,
    pluginContainer,
    plugins,
    app,
  }

  for (const plugin of plugins) {
    if (plugin.configureServer)
    // await
      plugin.configureServer(serverContext)
  }

  app.listen(5173, async () => {
    await optimize(root)
    console.log(green('Vite dev server'),
        `duration：${Date.now() - startTIme}ms`,
    )
    console.log(`> 本地访问路径: ${blue('http://localhost:5173')}`)
  })
}

export { startDevServer }
