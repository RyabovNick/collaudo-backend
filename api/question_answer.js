const knex = require('../config/database')

module.exports = async function(fastify, opts) {
  fastify.route({
    method: 'POST',
    url: '/question_answer',
    schema,
    handler,
  })
}

async function handler(req, reply) {
  const { question_id, answer_id, is_true } = req.body

  try {
    const result = await knex('question_answer').insert({
      question_id,
      answer_id,
      is_true,
    })

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
      answer_id: {
        type: 'integer',
      },
      is_true: {
        type: 'boolean',
      },
    },
    required: ['question_id', 'answer_id', 'is_true'],
  },
}
