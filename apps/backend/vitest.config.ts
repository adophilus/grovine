import { defineConfig } from 'vitest/config'
import {
  BaseSequencer,
  TestSpecification,
  type Vitest as VitestFromVitestNode
} from 'vitest/node'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths()],
  // resolve: {
  //   alias: {
  //     '@': './src'
  //   }
  // },
  test: {
    alias: {
      '@/': new URL('./src/', import.meta.url).pathname
    },
    cache: false,
    bail: 1,
    include: ['tests/e2e/*.ts'],
    maxConcurrency: 1,
    sequence: {
      sequencer: class Seqencer extends BaseSequencer {
        protected ctx: VitestFromVitestNode

        constructor(ctx: VitestFromVitestNode) {
          super(ctx)
          this.ctx = ctx
        }

        async shard(files: TestSpecification[]) {
          return files
        }

        async sort(files: TestSpecification[]) {
          return files
        }
      }
    },
    // maxWorkers: 1,
    // Force alphabetical file order
    fileParallelism: false,
    // Disable test isolation to ensure strict order
    isolate: false
  }
})
