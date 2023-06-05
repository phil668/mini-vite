import path from 'node:path'
import { expect, it } from 'vitest'
import { readFile } from 'fs-extra'
import { init, parse } from 'es-module-lexer'
import { normalizePath } from '../node/util'

it('normalize mac path', () => {
  expect(normalizePath('/Desktop/Fe/project/mini-vite/playground/react-tsx')).toBe('/Desktop/Fe/project/mini-vite/playground/react-tsx')
})

it('parse import export', async () => {
  const code = await readFile(path.resolve(__dirname, '../node/cli.ts'), { encoding: 'utf-8' })
  await init
  const [importItems, exportItems] = parse(code)
  expect(importItems).toMatchInlineSnapshot(`
    [
      {
        "a": -1,
        "d": -1,
        "e": 20,
        "n": "cac",
        "s": 17,
        "se": 21,
        "ss": 0,
      },
      {
        "a": -1,
        "d": -1,
        "e": 68,
        "n": "./server/index",
        "s": 54,
        "se": 69,
        "ss": 22,
      },
      {
        "a": -1,
        "d": -1,
        "e": 325,
        "n": "./server/index",
        "s": 311,
        "se": 326,
        "ss": 279,
      },
    ]
  `)
  expect(exportItems).toMatchInlineSnapshot(`
    [
      {
        "e": 276,
        "le": 276,
        "ln": "cli",
        "ls": 273,
        "n": "cli",
        "s": 273,
      },
      {
        "e": 302,
        "le": -1,
        "ln": undefined,
        "ls": -1,
        "n": "startDevServer",
        "s": 288,
      },
      {
        "e": 341,
        "le": -1,
        "ln": undefined,
        "ls": -1,
        "n": "default",
        "s": 334,
      },
    ]
  `)
})
