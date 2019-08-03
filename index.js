require('dotenv').config()

const fastify = require('fastify')({
  logger: true
})

fastify.get('/', async (request, reply) => {
  reply.type('application/json').code(200)
  return { hello: 'world' }
})

fastify.listen(process.env.PORT, (err, address) => {
  if (err) throw err
  fastify.log.info(`server listening on ${address}`)
})
