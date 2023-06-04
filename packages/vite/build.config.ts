import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: ['src/node/cli'],
  declaration: true,
  clean: true,
  rollup: {
    emitCJS: true,
  },
})
