require('dotenv').config({ path: '../.env' })
// Update with your config settings.

module.exports = {
  development: {
    client: 'mysql2',
    connection: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_DATABASE_DEV
    },
    pool: { min: 0, max: 10 }
  },

  staging: {
    client: 'mysql2',
    connection: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_DATABASE
    },
    pool: { min: 0, max: 200 },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'mysql2',
    connection: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_DATABASE
    },
    pool: { min: 0, max: 200 },
    migrations: {
      tableName: 'knex_migrations'
    }
  }
}
