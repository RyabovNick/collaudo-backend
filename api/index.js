module.exports = async function(fastify, opts) {
  fastify.register(require('./test'))
}
