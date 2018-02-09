const express = require('express')
const app = express()
const port = 3000
const path = require('path')
const rp = require('request-promise')
const exphbs = require('express-handlebars')

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

const { Pool } = require('pg')
// const conString = 'postgres://postgres:hkl4d21S@localhost/node_hero'
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'node_hero',
  password: 'hkl4d21S',
  port: 5432,
})

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