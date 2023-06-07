import type { NextHandleFunction } from 'connect'
import createDebug from 'debug'
import { cleanURL, isJsRequest } from '../../util'
import type { ServerContext } from '../index'

const debug = createDebug('dev')

async function transformRequest(
  url: string,
  serverContext: ServerContext,
) {
  const { pluginContainer } = serverContext
  url = cleanURL(url)
  // 依次调用resolveId,load,transform对代码进行处理
  const resolvedResult = await pluginContainer.resolveId(url)
  let transformResult
  if (resolvedResult?.id) {
    let code = await pluginContainer.load(resolvedResult.id)
    if (typeof code === 'object' && code !== null)
      code = code.code
    if (code)
      transformResult = await pluginContainer.transform(code, resolvedResult.id)
  }
  return transformResult
}

function transformMiddleware(serverContext: ServerContext): NextHandleFunction {
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  return async (req, res, next) => {
    if (req.method !== 'GET' || !req.url)
      return next()
    const { url } = req
    debug('transform middleware :%s', url)
    // 转译js请求
    if (isJsRequest(url)) {
      let result = await transformRequest(url, serverContext)
      if (!result)
        return next()
      if (result && typeof result !== 'string')
        result = result.code
      res.statusCode = 200
      res.setHeader('Content-Type', 'application/javascript')
      return res.end(result)
    }

    next()
  }
}

export { transformMiddleware }
