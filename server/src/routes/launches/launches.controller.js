const { getLaunches, abortLaunch, scheduleNewLaunch } = require('../../models/launches.model')

async function httpGetLaunches(request, response) {
    return response.status(200).json(await getLaunches())
}

async function httpAddLaunch(req, res) {
    const launchData = req.body
    const launchDate = new Date(launchData.launchDate)
    if (isNaN(launchDate) || !launchData.mission || !launchData.target || !launchData.rocket) {
        return res.status(400).json({
            error: `Some launch data is incorrect. launchData = ${JSON.stringify(launchData)}`
        })
    }

    const addedLaunch = Object.assign(launchData, {
        launchDate: launchDate,
        customer: ['NASA', 'ZTM'],
        upcoming: true,
        success: true
    })
    await scheduleNewLaunch(addedLaunch)
    return res.status(201).json(addedLaunch)
}

async function httpAbortLaunch(req, res) {
    const flightNumber = Number(req.params.flightNumber)
    try {
        const abortedLaunch = await abortLaunch(flightNumber)
        return res.status(200).json(abortedLaunch)
    } catch (err) {
        console.error(err)
        return res.status(404).json({
            error: err.message
        })
    }
}

module.exports = {
    httpGetLaunches,
    httpAddLaunch, 
    httpAbortLaunch
}