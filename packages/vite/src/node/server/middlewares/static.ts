import type { NextHandleFunction } from 'connect'
import sirv from 'sirv'
import type { ServerContext } from '..'
import { isImportRequest } from '../../util'

function staticMiddleWare(serverContext: ServerContext): NextHandleFunction {
  const asset = sirv(serverContext.root, { dev: true })
  return (req, res, next) => {
    if (!req.url)
      return
    if (isImportRequest(req.url))
      return
    asset(req, res, next)
  }
}

export { staticMiddleWare }
