/**
 * register all API here
 */

module.exports = async function(fastify, opts) {
  fastify.register(require('./theme'))
  fastify.register(require('./question'))
  fastify.register(require('./answer'))
  fastify.register(require('./type'))
  fastify.register(require('./question_type'))
  fastify.register(require('./question_answer'))
}
