import path from 'node:path'
import { readFile } from 'fs-extra'
import type { Loader } from 'esbuild'
import esbuild from 'esbuild'
import type { Plugin } from '../plugin'
import { isJsRequest } from '../util'

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
        console.log('code', transformCode)
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
