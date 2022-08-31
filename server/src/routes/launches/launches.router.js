const express = require('express')
const { httpGetLaunches, httpAddLaunch } = require('./launches.controller')

const launchesRouter = express.Router()
launchesRouter.get('/', httpGetLaunches)
launchesRouter.post('/', httpAddLaunch)

module.exports = launchesRouter