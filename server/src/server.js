const http = require('http')
const app = require('./app')
const { mongoConnect } = require('./services/mongo')

const { loadPlanetsData } = require('./models/planets.model')
const { loadLaunchesData } = require('./models/launches.model')

require('dotenv').config()

const PORT = process.env.PORT || 8000
const server = http.createServer(app)

async function initializeServer() {
    await mongoConnect()
    await loadPlanetsData()
    await loadLaunchesData()
    server.listen(PORT, () => {
        console.info(`Listening on port ${PORT}...`)
    })
}

initializeServer()
