export type UrlScheme = {
  serverUrl: string
  host: string
  port: string | null
  apiKey: string | null
  apiSecret: string | null
  cloudName: string | null
  folder: string | null
}

export const parseUrl = (url: string): UrlScheme => {
  const _url = new URL(url)

  const cloudName = _url.pathname.substring(1)
  const folder = _url.searchParams.get('folder')
  const serverUrl = new URL(_url.origin)
  serverUrl.protocol = _url.protocol
  serverUrl.port = _url.port

  return {
    serverUrl: serverUrl.toString(),
    host: _url.host,
    port: _url.port !== '' ? _url.port : null,
    apiKey: _url.username !== '' ? _url.username : null,
    apiSecret: _url.password !== '' ? _url.password : null,
    cloudName: cloudName !== '' ? cloudName : null,
    folder: folder !== '' ? folder : null
  }
}
