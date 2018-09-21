const { Pool, Client } = require('pg')

const { DATABASE_URL } = process.env

// const pool = new Pool(PG_URI)

const client = new Client({
  connectionString: DATABASE_URL,
})
client.connect(err => {
  err ? console.error(err) : 'Datebase connection has been successful'
})

module.exports = {
  query: (text, params) => pool.query(text, params)
}