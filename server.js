const express = require('express')
const app = express()
const port = 3000
const path = require('path')
const rp = require('request-promise')
const exphbs = require('express-handlebars')
const db = require('./config/db')
const { Pool } = require('pg')
//const { AccountingDepartment } = require("./myclass.ts")
//var AccDep = require('./myclass.ts').AccountingDepartment

app.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on ${port}`)
})

app.engine('.hbs', exphbs({
  defaultLayout: 'main',
  extname: '.hbs',
  layoutsDir: path.join(__dirname, 'views/layouts')
}))
app.set('view engine', '.hbs')
app.set('views', path.join(__dirname, 'views'))
app.use('/static', express.static(path.join(__dirname, 'static')))

app.get('/', (request, response) => {
  response.render('home', {
      name: 'Vladlen'
    })
})

const pool = new Pool(db)

app.get('/users', (request, response) => {
  pool.query('SELECT * FROM users')
  .then(res => {
    console.log('user:', res.rows[0])
    response.json({
      "total": res.rows.length,
      "rows": res.rows
    })
  })
  .catch(err => setImmediate(() => { throw err }))
  //pool.end()
})

app.post('/users/save',  function (req, res, next) {
  (async () => {
    const client = await pool.connect()

    try {
      await client.query('BEGIN')
      const { rows } = await client.query('INSERT INTO users(name, age) VALUES($1, $2) RETURNING age', ['John', 43])

      // const insertPhotoText = 'INSERT INTO photos(user_id, photo_url) VALUES ($1, $2)'
      // const insertPhotoValues = [res.rows[0].id, 's3.bucket.foo']
      // await client.query(insertPhotoText, insertPhotoValues)
      await client.query('COMMIT')
    } catch (e) {
      await client.query('ROLLBACK')
      throw e
    } finally {
      client.release()
    }
  })().catch(e => console.error(e.stack))
  res.sendStatus(200)
})

app.get('/:city', (req, res) => {
  rp({
      uri: 'http://apidev.accuweather.com/locations/v1/search',
      qs: {
          q: req.params.city,
          apiKey: 'hoArfRosT1215'
              // Используйте ваш ключ для accuweather API
      },
      json: true
  })
  .then((data) => {
      //res.send('data: ' + data);
      res.json({data: data[0]})
      //res.render('home', data)
  })
  .catch((err) => {
      console.log(err)
      res.render('error')
  })
})