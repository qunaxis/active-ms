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

const findUser = async (field, id) => {
  let result = []
  try {
      result = await pool.query(`SELECT * FROM users WHERE $1 = $2`, [field, id])
      console.log(`[DB.findhUser]: ${result.rowCount} rows was found by field '${field}'.`)        
      console.log(`[DB.findhUser]: ${result.rows}`)        
  } catch (error) {
      console.log('[ERROR]: ' + error)
  }
  return result
}

module.exports = {
  query: (text, params) => pool.query(text, params),
  findUser
}