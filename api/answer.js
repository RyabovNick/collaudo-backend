const knex = require('../config/database')

module.exports = async function(fastify, opts) {
  // fastify.post('/theme', handler)

  fastify.route({
    method: 'POST',
    url: '/answer',
    schema,
    handler,
  })
}

async function handler(req, reply) {
  const { name } = req.body

  try {
    const result = await knex('answer').insert({ name })

    return result
  } catch (err) {
    if (err.sqlMessage) {
      reply.code(418).send({
        code: err.code,
        error: err.sqlMessage,
      })
    } else {
      reply.code(418).send({
        code: err.code,
        error: err.message,
      })
    }
  }
}

const schema = {
  body: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
      },
    },
    required: ['name'],
  },
}
