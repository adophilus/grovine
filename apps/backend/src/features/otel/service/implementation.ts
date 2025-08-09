import opentelemetry from '@opentelemetry/sdk-node'
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node'
import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http'
import type OpenTelemetryService from './interface'
import OtelConfig from '@/features/config/configs/otel'

const config = OtelConfig

class OpenTelemetryServiceImplementation implements OpenTelemetryService {
  private declare sdk: opentelemetry.NodeSDK

  public initialize() {
    // For troubleshooting, set the log level to DiagLogLevel.DEBUG
    diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG)

    this.sdk = new opentelemetry.NodeSDK({
      traceExporter: new OTLPTraceExporter({
        url: config.endpoint,
        headers: {
          Authorization: config.api.key
        }
      }),
      instrumentations: [getNodeAutoInstrumentations()],
      serviceName: config.service.name
    })

    this.sdk.start()
  }

  public shutdown() {
    return this.sdk.shutdown()
  }
}

export default OpenTelemetryServiceImplementation
