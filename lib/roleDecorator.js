const knex = require('../config/database')

const admins = []

module.exports = async function(req) {
  const verify = await req.jwtVerify()

  // если авторизуемся, используя github
  // то как проверять есть ли такой пользователь?
  // const user = await knex
}
