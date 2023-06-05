import cac from 'cac'
import { startDevServer } from './server/index'

const cli = cac()

cli
  .command('[root]', 'Run the development server')
  .alias('serve')
  .alias('dev')
  .action(() => {
    startDevServer()
  })

cli.help()

cli.parse()

const a = 123

export { cli }
export { startDevServer } from './server/index'
export default a
