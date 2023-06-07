import { resolve } from 'node:path'
import type { NextHandleFunction } from 'connect'
import { pathExists, readFile } from 'fs-extra'
import type { ServerContext } from '../index'

/**
 * 处理html中间件
 * 读取html文件
 * 将html文件交给plugin处理,处理完之后返回给浏览器
 */
function indexHtmlMiddleware(serverContext: ServerContext): NextHandleFunction {
  const { root, plugins } = serverContext
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  return async (req, res, next) => {
    try {
      console.log('req.url', req.url)
      if (req.url === '/') {
        const indexHtmlPath = resolve(root, 'index.html')
        const isIndexHtmlExist = await pathExists(indexHtmlPath)
        if (isIndexHtmlExist) {
          let html = await readFile(indexHtmlPath, { encoding: 'utf-8' })
          for (const plugin of plugins) {
            if (plugin.transformIndexHtml)
              html = await plugin.transformIndexHtml(html)
          }
          res.statusCode = 200
          res.setHeader('Content-Type', 'text/html')
          console.log('indexHtmlPath', indexHtmlPath)
          return res.end(html)
        }
      }
      return next()
    }
    catch (error) {
      res.statusCode = 500
      return res.end('Internal Server Error')
    }
  }
}

export { indexHtmlMiddleware }
