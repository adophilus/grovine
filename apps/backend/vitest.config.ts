import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths()],
  // resolve: {
  //   alias: {
  //     '@': './src'
  //   }
  // },
  test: {
    bail: 1,
    testTimeout: 20000,
    hookTimeout: 20000,
    teardownTimeout: 20000,
    sequence: {
      shuffle: false,
      concurrent: false
    },
    include: ['tests/integration/*.ts'],
    // Disable test reordering based on status and file size
    retry: 0,
    maxConcurrency: 1,
    maxWorkers: 1,
    // Force alphabetical file order
    fileParallelism: false,
    // Disable test isolation to ensure strict order
    isolate: false
  }
})
