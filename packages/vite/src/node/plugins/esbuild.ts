import path from 'node:path'
import { readFile } from 'fs-extra'
import type { Loader } from 'esbuild'
import esbuild from 'esbuild'
import type { Plugin } from '../plugin'
import { isJsRequest } from '../util'

/**
 * 将ts tsx jsx利用esbuild转换成浏览器可以执行的代码
 * @returns
 */
function esbuildTransformPlugin(): Plugin {
  return {
    name: 'pvite:esbuild-transform',
    async load(id) {
      if (isJsRequest(id)) {
        try {
          const code = await readFile(id, { encoding: 'utf-8' })
          return code
        }
        catch (error) {
          return null
        }
      }
    },
    async transform(code, id) {
      if (isJsRequest(id)) {
        const extName = path.extname(id).slice(1) as Loader
        const { code: transformCode, map } = await esbuild.transform(code, {
          target: 'esnext',
          format: 'esm',
          sourcemap: true,
          loader: extName,
        })
        return {
          code: transformCode,
          map,
        }
      }
      return null
    },
  }
}

export { esbuildTransformPlugin }
