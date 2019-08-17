const knex = require('../config/database')

module.exports = async function(fastify, opts) {
  // fastify.post('/theme', handler)

  fastify.route({
    method: 'POST',
    url: '/theme',
    schema,
    handler,
  })
}

async function handler(req, reply) {
  const { name, count_question } = req.body

  try {
    const result = await knex('theme').insert({ name, count_question })

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
        maxLength: 255,
      },
      count_question: {
        type: 'integer',
      },
    },
    required: ['name', 'count_question'],
  },
}
