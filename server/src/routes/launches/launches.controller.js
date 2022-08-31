const { getLaunches, addLaunch } = require('../../models/launches.model')

function httpGetLaunches(request, response) {
    return response.status(200).json(getLaunches())
}

function httpAddLaunch(request, response) {
    const launchData = request.body
    const addedLaunch = Object.assign(launchData, {
        launchDate: new Date(launchData.launchDate),
        customer: ['NASA', 'ZTM'],
        upcoming: true,
        success: true
    })
    addLaunch(addedLaunch)
    return response.status(201).json(addedLaunch)
}

module.exports = {
    httpGetLaunches,
    httpAddLaunch
}