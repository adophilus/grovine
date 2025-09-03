import {
  LoggerProvider,
  SimpleLogRecordProcessor
} from '@opentelemetry/sdk-logs'
import { config } from '@/features/config'
import { Logger } from '@/features/logger'
import type { OpenTelemetryServiceImplementation } from './service'

type TsLogLogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'FATAL'

const tslogLogLevelToOpenTelemetrySeverityNumber: Record<
  TsLogLogLevel,
  number
> = {
  DEBUG: 5,
  INFO: 9,
  WARN: 13,
  FATAL: 21
} as const

class OpenTelemetryLogger extends Logger {
  constructor(
    private readonly service: OpenTelemetryServiceImplementation,
    options: any
  ) {
    super(options)

    const loggerProvider = new LoggerProvider({
      processors: [new SimpleLogRecordProcessor(this.service.getLogExporter())]
    })

    const otelLogger = loggerProvider.getLogger(config.otel.service.name)

    this.attachTransport((obj) => {
      const logLevel = obj._meta.logLevelName as TsLogLogLevel
      const severityNumber =
        tslogLogLevelToOpenTelemetrySeverityNumber[logLevel]

      const { _meta, ...objWithoutMeta } = obj

      otelLogger.emit({
        body: JSON.stringify(objWithoutMeta),
        severityText: logLevel,
        severityNumber
      })
    })
  }
}

export { OpenTelemetryLogger }
