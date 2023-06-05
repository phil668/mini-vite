import path from 'node:path'
import { build } from 'esbuild'
import { green } from 'picocolors'
import { PRE_BUNDLE_DIR } from '../constant'
import { scanPlugin } from './scanPlugin'
import { preBundlePlugin } from './preBundlePlugin'

async function optimize(root: string) {
  // 1. resolve entry
  const entry = path.resolve(root, 'src/main.tsx')
  const deps = new Set<string>()
  // 2. scan deps
  await build({
    entryPoints: [entry],
    bundle: true,
    write: false,
    plugins: [scanPlugin(deps)],
  })
  // 3. build deps
  console.log(
    `${green('scan deps')}:\n${[...deps]
        .map(green)
        .map(item => `  ${item}`)
        .join('\n')
    }
    `,
  )

  // 对扫描到的依赖打包
  await build({
    entryPoints: [...deps],
    bundle: true,
    write: true,
    format: 'esm',
    splitting: true,
    outdir: path.resolve(root, PRE_BUNDLE_DIR),
    plugins: [preBundlePlugin(deps)],
  })
}

export { optimize }
