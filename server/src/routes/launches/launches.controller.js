const launches = require('../../models/launches.model')

function getLaunches(request, response) {
    return response.status(200).json(launches)
}

module.exports = {
    getLaunches
}