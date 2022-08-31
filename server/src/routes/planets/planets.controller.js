const { getPlanets } = require('../../models/planets.model')

function httpGetPlanets(request, response) {
    return response.status(200).json(getPlanets())
}

module.exports = { httpGetPlanets }