const UploadConfig = {
  allowedMimetypes: ['image/png', 'image/jpeg', 'image/jpg'],
  path: 'public/uploads',
  maxFieldSize: 25 * 1024 * 1024,
  maxUploadSize: 10 * 1024 * 1024
}

export default UploadConfig
