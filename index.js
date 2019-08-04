require('dotenv').config()

const fse = require('fs-extra')
const winston = require('winston')

const errorLogsPath = './logs/error.log'
const combinedLogsPath = './logs/combined.log'

fse.ensureFile(errorLogsPath, err => {
  if (err) console.log('err: ', err)
})

fse.ensureFile(combinedLogsPath, err => {
  if (err) console.log('err', err)
})

// Create custom logger
const logger = winston.createLogger({
  // Define levels required by Fastify (by default winston has verbose level and does not have trace)
  levels: {
    fatal: 0,
    error: 1,
    warn: 2,
    info: 3,
    trace: 4,
    debug: 5
  },
  // Setup log level
  level: 'info',
  // Setup logs format
  format: winston.format.json(),
  // Define transports to write logs, it could be http, file or console
  transports: [
    new winston.transports.File({ filename: errorLogsPath, level: 'error' }),
    new winston.transports.File({ filename: combinedLogsPath })
  ]
})

const fastify = require('fastify')({
  logger: true // set to "logger" to turn on winston log
})
const cors = require('fastify-cors')

fastify.register(cors, {
  origin: '*',
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['token'],
  credentials: true
})

fastify.setNotFoundHandler((request, reply) => {
  fastify.log.debug('Route not found: ', request.req.url)

  reply.status(404).send({ message: 'Not found' })
})

fastify.setErrorHandler((error, request, reply) => {
  fastify.log.debug(`Request url: `, request.req.url)
  fastify.log.debug(`Payload: `, request.body)
  fastify.log.error(`Error occurred: `, error)

  reply.status(500).send({ message: 'Error occurred during request' })
})

fastify.get('/', async (request, reply) => {
  fastify.log.info('Sending hello')

  reply.type('application/json').code(200)
  return { hello: 'world' }
})

// register folder with all API
// set /api prefix to all API
fastify.register(require('./api'), { prefix: '/api' })

fastify.listen(
  process.env.PORT || 3000,
  process.env.HOST || '127.0.0.1',
  (err, address) => {
    if (err) throw err
    console.log(`server listening on ${address}`)
  }
)
