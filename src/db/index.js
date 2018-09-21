const { Pool } = require('pg')

let DATABASE_URL = ''

if (process.env.NODE_ENV == 'production') {
  DATABASE_URL = process.env.DATABASE_URL
} else {
  DATABASE_URL = 'postgres://postgres:Diman222319@localhost:5432/postgres'
}



const pool = new Pool({
  connectionString: DATABASE_URL,
})

module.exports = {
  query: (text, params) => pool.query(text, params)
}