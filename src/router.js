import { Router } from 'express'
import db from './db/index.js'


const router = Router()

db.query('SELECT NOW()', (err, res) => {
  console.log(res.rows[0])
})

// module.exports = router

// router.get('/:id', async (req, res) => {
//   const { id } = req.params
//   const { rows } = await db.query('SELECT * FROM users WHERE id = $1', [id])
//   res.send(rows[0])
// })
/**
 * GET home page
 */
router.get('/', (req, res) => {
  let user = {}

  if (req.user != undefined) {
    user = {
      label: `${req.user.name} ${req.user.surname} (id${req.user.vk_id})`,
      id: req.user.vk_id,
      text: `Тестовое сообщение для пользователя ${req.user.name} ${req.user.surname}`
    }
  } else {
    user = {
      label: `Yo! Please, auth into that shit.`,
      id: 0,
      text: ``
    }
  }
  res.render('index', { title: 'AMS – Active Management System', user: user.label, id: user.id, text: user.text })
})

router.get('/utable', (req, res) => {
  db.query(`DROP TABLE IF EXISTS "users" CASCADE
    CREATE TABLE "users" (
      "id" SERIAL NOT NULL,
      "surname" text NOT NULL,
      "name" text NOT NULL,
      "patronymic" text,
      "bday" date,
      "phonenumber" varchar(10) NOT NULL,
      "vk_id" text,
      "email" text,
      "photo_100_url" text,
      "photo_max_url" text,
      "access_token" text,
      PRIMARY KEY("id")
    )`, 
    (err, res) => {
      err ? console.log(err) : console.log(`Table "users" has been created.`)
  })
  res.redirect('/')
})

router.get('/users', async (req, res) => {
  let users = []
  try {
    users = await db.query(`SELECT * FROM users`)
  } catch (error) {
    console.log(error)
  }
  console.log(users)
  res.redirect('/')
})

/**
 * GET /list
 *
 * This is a sample route demonstrating
 * a simple approach to error handling and testing
 * the global error handler. You most certainly want to
 * create different/better error handlers depending on
 * your use case.
 */
router.get('/list', (req, res, next) => {
  const { title } = req.query

  if (title == null || title === '') {
    // You probably want to set the response HTTP status to 400 Bad Request
    // or 422 Unprocessable Entity instead of the default 500 of
    // the global error handler (e.g check out https://github.com/kbariotis/throw.js).
    // This is just for demo purposes.
    next(new Error('The "title" parameter is required'))
    return
  }

  res.render('index', { title })
})

export default router
