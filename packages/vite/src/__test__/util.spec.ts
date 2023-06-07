/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import path from 'node:path'
import { expect, it } from 'vitest'
import { readFile } from 'fs-extra'
import { init, parse } from 'es-module-lexer'
import { sync } from 'resolve'
import { cleanURL, normalizePath } from '../node/util'

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

it('parse cjs module', () => {
  const entryPath = sync('react', { basedir: process.cwd() })
  expect(entryPath).toMatchInlineSnapshot('"/Users/liuyue/Desktop/Fe/project/mini-vite/packages/vite/node_modules/react/index.js"')
  const res = require(entryPath)
  expect(res).toMatchInlineSnapshot(`
    {
      "Children": {
        "count": [Function],
        "forEach": [Function],
        "map": [Function],
        "only": [Function],
        "toArray": [Function],
      },
      "Component": [Function],
      "Fragment": Symbol(react.fragment),
      "Profiler": Symbol(react.profiler),
      "PureComponent": [Function],
      "StrictMode": Symbol(react.strict_mode),
      "Suspense": Symbol(react.suspense),
      "__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED": {
        "IsSomeRendererActing": {
          "current": false,
        },
        "ReactCurrentBatchConfig": {
          "transition": 0,
        },
        "ReactCurrentDispatcher": {
          "current": null,
        },
        "ReactCurrentOwner": {
          "current": null,
        },
        "ReactDebugCurrentFrame": {
          "getCurrentStack": null,
          "getStackAddendum": [Function],
          "setExtraStackFrame": [Function],
        },
        "assign": [Function],
      },
      "cloneElement": [Function],
      "createContext": [Function],
      "createElement": [Function],
      "createFactory": [Function],
      "createRef": [Function],
      "forwardRef": [Function],
      "isValidElement": [Function],
      "lazy": [Function],
      "memo": [Function],
      "useCallback": [Function],
      "useContext": [Function],
      "useDebugValue": [Function],
      "useEffect": [Function],
      "useImperativeHandle": [Function],
      "useLayoutEffect": [Function],
      "useMemo": [Function],
      "useReducer": [Function],
      "useRef": [Function],
      "useState": [Function],
      "version": "17.0.0",
    }
  `)
  expect(Object.keys(res)).toMatchInlineSnapshot(`
    [
      "Fragment",
      "StrictMode",
      "Profiler",
      "Suspense",
      "Children",
      "Component",
      "PureComponent",
      "__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED",
      "cloneElement",
      "createContext",
      "createElement",
      "createFactory",
      "createRef",
      "forwardRef",
      "isValidElement",
      "lazy",
      "memo",
      "useCallback",
      "useContext",
      "useDebugValue",
      "useEffect",
      "useImperativeHandle",
      "useLayoutEffect",
      "useMemo",
      "useReducer",
      "useRef",
      "useState",
      "version",
    ]
  `)
  expect(path.extname(entryPath).slice(1)).toBe('js')
})

it('clear url', () => {
  expect(cleanURL('https://www.baidu.com/detail#dashboard?key="liuyue"')).toBe('https://www.baidu.com/detail')
})
