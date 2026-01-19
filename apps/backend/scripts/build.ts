import { Command } from '@effect/cli'
import { Command as PlatformCommand } from '@effect/platform'
import { NodeContext, NodeRuntime } from '@effect/platform-node'
import { Effect } from 'effect'
import { promises as fs } from 'node:fs'

const buildDirectory = './build'

const buildSource = () =>
  Effect.gen(function* () {
    const entrypoint = './scripts/start.ts'

    console.log('⚙ Building server...')
    yield* PlatformCommand.make(
      'bun',
      'build',
      entrypoint,
      '--target=node',
      `--outdir=${buildDirectory}`,
      '--entry-naming=[dir]/server.mjs'
    ).pipe(
      PlatformCommand.stdout('inherit'),
      PlatformCommand.stderr('inherit'),
      PlatformCommand.runInShell(true),
      PlatformCommand.start,
      Effect.flatMap((proc) => proc.exitCode),
      Effect.scoped
    )

    yield* Effect.promise(() =>
      fs.mkdir(`${buildDirectory}/build`, { recursive: true })
    )

    const nativeFiles = ['better_sqlite3.node']

    for (const file of nativeFiles) {
      const foundFile = yield* findFile(`../../node_modules/.pnpm`, file)

      if (foundFile) {
        yield* Effect.tryPromise({
          try: () => fs.copyFile(foundFile, `${buildDirectory}/build/${file}`),
          catch: (err) => new Error(`Failed to copy ${file}: ${err}`)
        })
      }
    }

    yield* Effect.promise(() =>
      fs.writeFile(
        `${buildDirectory}/package.json`,
        JSON.stringify({ type: 'module' })
      )
    )

    console.log('✅ Built server')
  })

const findFile = (
  dir: string,
  filename: string
): Effect.Effect<string | null, Error, never> =>
  Effect.gen(function* () {
    const entries = yield* Effect.tryPromise({
      try: () => fs.readdir(dir, { withFileTypes: true }),
      catch: (err) => new Error(`Failed to read ${dir}: ${err}`)
    })

    for (const entry of entries) {
      const fullPath = `${dir}/${entry.name}`

      if (entry.isDirectory()) {
        const found = yield* findFile(fullPath, filename)
        if (found) return found
      } else if (entry.name === filename) {
        return fullPath
      }
    }

    return null
  })

const buildMigrations = () =>
  Effect.gen(function* () {
    const migrationsDirectory = './migrations'

    console.log('⚙ Building migrations...')

    yield* PlatformCommand.make(
      'bun',
      'build',
      `${migrationsDirectory}/*.ts`,
      '--outdir',
      buildDirectory,
      '--target=node'
    ).pipe(
      PlatformCommand.stdout('inherit'),
      PlatformCommand.stderr('inherit'),
      PlatformCommand.runInShell(true),
      PlatformCommand.start,
      Effect.flatMap((proc) => proc.exitCode),
      Effect.scoped
    )

    console.log('✅ Built migrations')
  })

const cli = Command.make('cli', {}, () =>
  Effect.gen(function* () {
    yield* Effect.promise(() => fs.mkdir(buildDirectory, { recursive: true }))

    yield* buildSource()
    yield* buildMigrations()

    console.log('✅ Build complete')
  })
)

const app = Command.run(cli, {
  name: 'build',
  version: '0.0.1'
})

Effect.suspend(() => app(process.argv)).pipe(
  Effect.provide(NodeContext.layer),
  NodeRuntime.runMain
)
