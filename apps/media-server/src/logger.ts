import { type ILogObj, Logger } from 'tslog'

const logger = new Logger<ILogObj>({ name: 'App', type: 'pretty' })

export default logger
