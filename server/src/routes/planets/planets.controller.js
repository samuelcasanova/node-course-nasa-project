const { getPlanets } = require('../../models/planets.model')

function httpGetPlanets(req, res) {
    return res.status(200).json(getPlanets())
}

module.exports = { httpGetPlanets }