import winston from 'winston'

const { createLogger, transports } = winston

// levels: { 
//   error: 0, 
//   warn: 1, 
//   info: 2, 
//   verbose: 3, 
//   debug: 4, 
//   silly: 5 
// }

const logger = createLogger({
  levels: winston.config.syslog.levels,
  transports: [
    new transports.Console({ level: 'silly' }),
    new transports.File({
      filename: 'combined.log',
      level: 'info'
    })
  ]
})

export default logger