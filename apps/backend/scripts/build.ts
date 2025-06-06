import '@/features/config'
import { Command, Options } from '@effect/cli'
import { Effect, Option } from 'effect'
import { NodeContext, NodeRuntime } from '@effect/platform-node'
import { FileSystem, Command as PlatformCommand } from '@effect/platform'

const config = {
  prod: {
    config: {
      version: 3,
      routes: [
        {
          src: '/.*',
          dest: '/'
        }
      ]
    },
    functions: {
      runtime: 'nodejs20.x',
      handler: 'server.mjs'
    }
  }
}

const buildSource = (target: 'production' | 'development') =>
  Effect.gen(function* () {
    const buildDirectory = './build'

    console.log('⚙ Building server...')
    yield* PlatformCommand.make(
      'bun',
      'build',
      target === 'production' ? './scripts/prod.ts' : './scripts/dev.ts',
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
    console.log('✅ Built server\n')
  })

const cli = Command.make(
  'cli',
  {
    target: Options.optional(
      Options.choice('target', ['production', 'development'])
    )
  },
  ({ target }) =>
    target.pipe(
      Option.match({
        onSome: (target) =>
          target === 'development'
            ? buildSource(target).pipe(
                Effect.andThen(() => console.log('✅ Build complete'))
              )
            : buildSource(target).pipe(
                Effect.andThen(() =>
                  Effect.gen(function* () {
                    const fs = yield* FileSystem.FileSystem
                    const outputDirectory = './.vercel/output'

                    yield* fs.remove(outputDirectory, {
                      recursive: true,
                      force: true
                    })

                    yield* fs.makeDirectory(
                      `${outputDirectory}/functions/index.func`,
                      { recursive: true }
                    )

                    yield* fs.writeFile(
                      `${outputDirectory}/config.json`,
                      new TextEncoder().encode(
                        JSON.stringify(config.prod.config)
                      )
                    )

                    yield* fs.writeFile(
                      `${outputDirectory}/functions/index.func/.vc-config.json`,
                      new TextEncoder().encode(
                        JSON.stringify(config.prod.functions)
                      )
                    )

                    yield* fs.copy(
                      './build',
                      `${outputDirectory}/functions/index.func`
                    )

                    console.log('✅ Build complete')
                  })
                )
              ),
        onNone: () =>
          buildSource('production').pipe(
            Effect.andThen(() =>
              Effect.gen(function* () {
                const fs = yield* FileSystem.FileSystem
                const outputDirectory = './.vercel/output'

                yield* fs.remove(outputDirectory, {
                  recursive: true,
                  force: true
                })

                yield* fs.makeDirectory(
                  `${outputDirectory}/functions/index.func`,
                  { recursive: true }
                )

                yield* fs.writeFile(
                  `${outputDirectory}/config.json`,
                  new TextEncoder().encode(JSON.stringify(config.prod.config))
                )

                yield* fs.writeFile(
                  `${outputDirectory}/functions/index.func/.vc-config.json`,
                  new TextEncoder().encode(
                    JSON.stringify(config.prod.functions)
                  )
                )

                yield* fs.copy(
                  './build',
                  `${outputDirectory}/functions/index.func`
                )

                console.log('✅ Build complete')
              })
            )
          )
      })
    )
)

const app = Command.run(cli, {
  name: 'build',
  version: '0.0.1'
})

Effect.suspend(() => app(process.argv)).pipe(
  Effect.provide(NodeContext.layer),
  NodeRuntime.runMain
)
