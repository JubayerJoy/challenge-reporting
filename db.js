let knex

if (!knex) {
  knex = require('knex')({
    client: 'sqlite3',
    connection: {
      filename: './data/students.db'
    },
    useNullAsDefault: true
  })
}

module.exports = knex
