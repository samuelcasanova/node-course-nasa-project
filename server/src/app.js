const express = require('express')
const path = require('path')
const morgan = require('morgan')

const api = require('./routes/api')

const app = express()

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  res.header("Access-Control-Allow-Methods", "*")
  next();
})
app.use(morgan('combined'))
app.use(express.json())
app.use(express.static(path.join(__dirname, '..', 'public')))

app.use('/v1', api)

app.get('/*', (req, res) => {res.sendFile(path.join(__dirname, '..', 'public', 'index.html'))})


module.exports = app