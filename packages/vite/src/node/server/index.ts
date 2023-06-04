import connect from 'connect'
import { blue, green } from 'picocolors'
import { optimize } from '../optimizer/index'

function startDevServer() {
  const app = connect()
  const root = process.cwd()
  const startTIme = Date.now()
  app.listen(5173, async () => {
    await optimize(root)
    console.log(green('Vite dev server'),
        `duration：${Date.now() - startTIme}ms`,
    )
    console.log(`> 本地访问路径: ${blue('http://localhost:5173')}`)
  })
}

export { startDevServer }
