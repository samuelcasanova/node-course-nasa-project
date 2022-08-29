const planets = require('../../models/planets.model')

function getPlanetsController(request, response) {
    return response.status(200).json(planets)
}

module.exports = { getPlanetsController }