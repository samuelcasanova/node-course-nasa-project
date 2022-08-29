const express = require('express')
const { getPlanetsController } = require('./planets.controller')

const planetsRouter = express.Router()

planetsRouter.get('/planets', getPlanetsController)

module.exports = planetsRouter