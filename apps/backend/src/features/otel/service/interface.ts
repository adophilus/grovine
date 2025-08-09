abstract class OpenTelemetryService {
  public abstract initialize(): void
  public abstract shutdown(): void
}

export default OpenTelemetryService
