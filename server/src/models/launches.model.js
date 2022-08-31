const INITIAL_FLIGHT_NUMBER = 100
const launches = [
    {
        flightNumber: INITIAL_FLIGHT_NUMBER,
        mission: 'Kepler exploration X',
        rocket: 'Explorer IS 1',
        launchDate: new Date('2030/08/01'),
        destination: 'Kepler-442 b',
        customer: ['NASA', 'SpaceX'],
        upcoming: true,
        success: true
    }
]
let latestFlightNumber = INITIAL_FLIGHT_NUMBER

function getLaunches() {
    return launches
}

function addLaunch(launch) {
    launch.flightNumber = ++latestFlightNumber
    launches.push(launch)
}

module.exports = {
    getLaunches,
    addLaunch
}
