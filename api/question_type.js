const knex = require('../config/database')

module.exports = async function(fastify, opts) {
  // fastify.post('/theme', handler)

  fastify.route({
    method: 'POST',
    url: '/question_type',
    schema,
    handler,
  })
}

async function handler(req, reply) {
  const { question_id, type_id } = req.body

  try {
    const result = await knex('question_type').insert({ question_id, type_id })

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
      question_id: {
        type: 'integer',
      },
      type_id: {
        type: 'integer',
      },
    },
    required: ['question_id', 'type_id'],
  },
}
