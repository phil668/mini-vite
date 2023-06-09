import os from 'node:os'
import path from 'node:path'
import { HASH_RE, JS_TYPES_RE, QUERY_RE } from './constant'

const isWindows = os.platform() === 'win32'

function slash(path: string) {
  return path.replace(/\\/g, '/')
}

function normalizePath(id: string): string {
  return path.posix.normalize(isWindows ? slash(id) : id)
}

function cleanURL(url: string) {
  return url.replace(HASH_RE, '').replace(QUERY_RE, '')
}

function isJsRequest(id: string) {
  if (!id)
    return false

  if (JS_TYPES_RE.test(id))
    return true
  // 如果没有后缀并且不以/结尾的话,就是个目录,也视为js请求
  if (!path.extname(id) && !id.endsWith('/'))
    return true

  return false
}

function isCssRequest(id: string) {
  return cleanURL(id).endsWith('.css')
}

function isImportRequest(id: string) {
  return id.endsWith('?import')
}

function removeImportQuery(id: string) {
  return id.replace(/\?import$/g, '')
}

function getShortName(file: string, root: string) {
  return file.startsWith(`${root}/`) ? path.posix.relative(root, file) : file
}

export { normalizePath, cleanURL, isJsRequest, isCssRequest, isImportRequest, removeImportQuery, getShortName }
