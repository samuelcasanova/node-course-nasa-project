const API_BASE_URL = 'v1'

async function httpGetPlanets() {
  console.info('Fetching planets...')
  const response = await fetch(`${API_BASE_URL}/planets`)
  const planets = await response.json()
  console.info(`Fetched ${planets?.length} planets`)
  return planets
}

// Load launches, sort by flight number, and return as JSON.
async function httpGetLaunches() {
  console.info('Fetching launches...')
  const response = await fetch(`${API_BASE_URL}/launches`)
  const launches = await response.json()
  console.info(`Fetched ${launches?.length} launches`)
  return launches
}

// Submit given launch data to launch system.
async function httpSubmitLaunch(launch) {
  console.info(`Submitting a new launch with mission ${launch.mission}`)
  const response = await fetch(`${API_BASE_URL}/launches`, { 
    method: 'POST', 
    body: JSON.stringify(launch), 
    headers: {
      'Content-Type': 'application/json'
    }
  })
  const addedLaunch = await response.json()
  console.info(`Added launch with flightNumber ${addedLaunch.flightNumber}`)
  return response.ok
}

async function httpAbortLaunch(id) {
  console.info(`Aborting launch with id ${id}...`)
  const response = await fetch(`${API_BASE_URL}/launches/${id}`, { 
    method: 'DELETE'
  })
  const abortedLaunch = await response.json()
  console.info(`Aborted launch with flightNumber ${abortedLaunch.flightNumber}`)
  return response.ok
}

export {
  httpGetPlanets,
  httpGetLaunches,
  httpSubmitLaunch,
  httpAbortLaunch,
};