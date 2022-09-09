const axios = require('axios')
const launches = require('./launches.mongo')
const planets = require('./planets.mongo')

const INITIAL_FLIGHT_NUMBER = 100

// saveLaunch({
//     flightNumber: INITIAL_FLIGHT_NUMBER, //flight_number
//     mission: 'Kepler exploration X', //name
//     rocket: 'Explorer IS 1', //rocket.name
//     launchDate: new Date('2030/08/01'), //date_local
//     target: 'Kepler-296 f', //???
//     customers: ['NASA', 'SpaceX'], //for each payload in payloads, payload.customers
//     upcoming: true, //upcoming
//     success: true //success
// })

async function loadLaunchesData() {
    console.info('Trying to load SpaceX launches data.')
    const isLaunchesDataAlreadyLoadedIntoDB = !!(await getLaunchByFlightNumber(1))
    if(isLaunchesDataAlreadyLoadedIntoDB){
        console.info('SpaceX launches already loaded in the database.')
    } else {
        console.info('Loading SpaceX launches for the first time...')
        await loadLaunchesDataIntoDB()
        console.info('SpaceX launches successfully saved into the database.')
    }
}

async function loadLaunchesDataIntoDB() {
    const response = await axios.post('https://api.spacexdata.com/v5/launches/query', {
        query: {},
        options: {
            pagination: false,
            populate: [
              {
                  path: 'rocket',
                  select: {
                      name: 1
                  }
              },
              {
                  path: 'payloads',
                  select: {
                      customers: 1
                  }
              }
            ] 
        }
      })
    const launchDocs = response.data.docs
    console.info(`Got ${launchDocs.length} launches from SpaceX API.`)
    for (const launchDoc of launchDocs) {
        console.info(`Processing SpaceX launchDoc with flightNumber ${launchDoc.flight_number} and name ${launchDoc.name}`)
        const launch = parseLaunchDoc(launchDoc)
        await saveLaunch(launch)
        console.info('SpaceX launchDoc converted to a regular launch and saved')
    }
}

function parseLaunchDoc(launchDoc) {
    const customers = launchDoc.payloads.reduce((prevCustomers, currentPayload) => {
        const newCustomers = currentPayload.customers.reduce((prevNewCustomers, currentCustomer) => {
            if (!prevCustomers.some((customer) => customer === currentCustomer)) {
                return [...prevNewCustomers, currentCustomer]
            }
            return prevNewCustomers
        }, [])
        return [...prevCustomers, ...newCustomers]
    }, [])
    return {
        flightNumber: launchDoc.flight_number,
        mission: launchDoc.name,
        rocket: launchDoc.rocket?.name,
        launchDate: new Date(launchDoc.date_local),
        customers: customers,
        upcoming: launchDoc.upcoming == 'true',
        success: launchDoc.success == 'true'
    }
}

async function getLaunchByFlightNumber(flightNumber) {
    return await launches.findOne({ flightNumber: flightNumber })
}  

async function getLaunches() {
    const allLaunches = await launches.find({}, {
        _id: 0,
        __v: 0
    }).sort({
        flightNumber: 1
    })
    console.info(`Retrieved ${allLaunches.length} launches.`)
    return allLaunches
}

async function saveLaunch(launch) {
    const launchToBeSaved = {
        ...launch,
        success: launch.success === null ? true : launch.success,
        upcoming: launch.upcoming === null ? true : launch.upcoming
    }
    if(!launch.flightNumber) {
        launchToBeSaved.flightNumber = await getLastFlightNumber() + 1
    }
    await launches.updateOne({
        flightNumber: launchToBeSaved.flightNumber
    }, launchToBeSaved, { upsert: true })
}

async function scheduleNewLaunch(launch) {
    const planet = await planets.findOne({
        keplerName: launch.target
    })
    if (!planet){
        throw new Error('No matching planet found')
    }

    await saveLaunch(launchToBeSaved)
}

async function abortLaunch(flightNumber) {
    const launchToAbort = launches.findOne({
        flightNumber: flightNumber
    })

    if (!launchToAbort) {
        throw new Error(`Launch with id ${flightNumber} not found while trying to abort`)
    }
    console.info(`Aborting launch ${flightNumber} with mission ${launchToAbort.mission}`)
    
    await launches.updateOne({
        flightNumber: flightNumber
    }, {
        success: false,
        upcoming: false
    }, { upsert: false })
}

async function getLastFlightNumber() {
    const latestLaunch = await launches.findOne({}).sort('-flightNumber')
    if (!latestLaunch) {
        return INITIAL_FLIGHT_NUMBER
    }
    return latestLaunch.flightNumber
}

module.exports = {
    loadLaunchesData,
    parseLaunchDoc,
    getLaunches,
    saveLaunch,
    scheduleNewLaunch,
    abortLaunch
}
