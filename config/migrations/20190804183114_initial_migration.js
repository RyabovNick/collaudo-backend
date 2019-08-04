exports.up = function(knex) {
  return knex.schema.createTable('question', t => {
    t.increments('id')
    t.string('name').notNullable()
  })
}

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('question')
}
