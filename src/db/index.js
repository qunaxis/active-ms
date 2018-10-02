import { Pool } from 'pg'
import { readFileSync } from 'fs'
import sql from './createSchema'

let DATABASE_URL = ''


if (process.env.NODE_ENV == 'production') {
  DATABASE_URL = process.env.DATABASE_URL
} else {
  DATABASE_URL = 'postgres://postgres:Diman222319@localhost:5432/postgres'
}



const pool = new Pool({
  connectionString: DATABASE_URL,
})

const find = async (table, field, filter) => {
  let result = []
  try {
      result = await pool.query(`SELECT * FROM ${table} WHERE ${field} = $1`, [filter]) // Придумать замену, мб либа, составляющая SQL-запросы – так оставлять точно не дело
      console.log(`[DB.find]: ${result.rowCount} rows was found by field '${field}'.`)        
      console.log(`[DB.find]: ${toString(result.rows)}`)        
  } catch (error) {
      console.log('[ERROR]: ' + error)
  }
  return result
}

const createSchema = async() => {
  let result
  try {
    result = await pool.query(sql)
  } catch (error) {
    result = error
  }
  return result
}

module.exports = {
  query: (text, params) => pool.query(text, params),
  find,
  createSchema
}