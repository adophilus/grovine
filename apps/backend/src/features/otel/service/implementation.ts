import opentelemetry from '@opentelemetry/sdk-node'
// import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node'
import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http'
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http'
import type OpenTelemetryService from './interface'
import { config } from '@/features/config'

class OpenTelemetryServiceImplementation implements OpenTelemetryService {
  private declare readonly sdk: opentelemetry.NodeSDK
  private declare readonly traceExporter: OTLPTraceExporter
  private declare readonly logExporter: OTLPLogExporter

  constructor() {
    const otelConfig = {
      url: config.otel.endpoint,
      headers: {
        Authorization: `Basic ${config.otel.api.key}`
      }
    }

    this.logExporter = new OTLPLogExporter(otelConfig)

    this.traceExporter = new OTLPTraceExporter(otelConfig)

    diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.INFO)

    this.sdk = new opentelemetry.NodeSDK({
      traceExporter: this.traceExporter,
      serviceName: config.otel.service.name
      // instrumentations: [getNodeAutoInstrumentations()],
    })
  }

  public getLogExporter() {
    return this.logExporter
  }

  public getTraceExporter() {
    return this.traceExporter
  }

  public initialize() {
    this.sdk.start()
  }

  public shutdown() {
    return this.sdk.shutdown()
  }
}

export default OpenTelemetryServiceImplementation
