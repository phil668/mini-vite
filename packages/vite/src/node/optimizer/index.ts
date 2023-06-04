import path from 'node:path'
import { build } from 'esbuild'
import { green } from 'picocolors'
import { scanPlugin } from './scanPlugin'

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
}

export { optimize }
