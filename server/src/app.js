const express = require('express')
const planetsRouter = require('./routes/planets/planets.router')
const path = require('path')

const app = express()

app.use(express.static(path.join(__dirname, '..', 'public')))
app.get('/', (req, res) => {res.sendFile(path.join(__dirname, '..', 'public', 'index.html'))})

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    next();
  });

app.use(express.json())
app.use(planetsRouter)

module.exports = app