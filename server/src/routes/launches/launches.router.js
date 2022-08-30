const express = require('express')
const { getLaunches } = require('./launches.controller')

const launchesRouter = express.Router()

launchesRouter.get('/launches', getLaunches)

module.exports = launchesRouter