import os from 'node:os'
import path from 'node:path'

const isWindows = os.platform() === 'win32'

function slash(path: string) {
  return path.replace(/\\/g, '/')
}

export function normalizePath(id: string): string {
  return path.posix.normalize(isWindows ? slash(id) : id)
}
