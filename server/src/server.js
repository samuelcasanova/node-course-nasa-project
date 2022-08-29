const http = require('http')
const app = require('./app')

const { loadPlanetsData } = require('./models/planets.model')

const PORT = process.env.PORT || 8000
const server = http.createServer(app)

async function initializeServer() {
    await loadPlanetsData()
    server.listen(PORT, () => {
        console.info(`Listening on port ${PORT}...`)
    })
}

initializeServer()