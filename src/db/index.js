const { Pool, Client } = require('pg')

const { PG_URI } = process.env

// const pool = new Pool(PG_URI)

const client = new Client({
  connectionString: PG_URI,
})
client.connect(err => {
  err ? console.error(err) : 'Datebase connection has been successful'
})

module.exports = {
  query: (text, params) => pool.query(text, params)
}