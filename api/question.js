const knex = require('../config/database')

module.exports = async function(fastify, opts) {
  fastify.route({
    method: 'POST',
    url: '/question',
    schema,
    handler,
  })
}

async function handler(req, reply) {
  const { name, theme_id, difficulty } = req.body

  try {
    const result = await knex('question').insert({ name, theme_id, difficulty })

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
      theme_id: {
        type: 'integer',
      },
      difficulty: {
        type: 'integer',
      },
    },
    required: ['name', 'theme_id', 'difficulty'],
  },
}
