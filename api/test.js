module.exports = async function(fastify, opts) {
  fastify.get('/test', testHandler)
}

async function testHandler(req, reply) {
  return { test: 'test' }
}
