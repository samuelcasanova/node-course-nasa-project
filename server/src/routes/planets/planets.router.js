const express = require('express')
const { httpGetPlanets } = require('./planets.controller')

const planetsRouter = express.Router()
planetsRouter.get('/', httpGetPlanets)

module.exports = planetsRouter