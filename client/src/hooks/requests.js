async function httpGetPlanets() {
  console.info('Fetching planets...')
  const response = await fetch('http://localhost:8000/planets')
  const planets = await response.json()
  console.info('Fetched planets:', planets)
  return planets
}

// Load launches, sort by flight number, and return as JSON.
async function httpGetLaunches() {
  console.info('Fetching launches...')
  const response = await fetch('http://localhost:8000/launches')
  const launches = await response.json()
  console.info('Fetched launches:', launches)
  return launches
}

// Submit given launch data to launch system.
async function httpSubmitLaunch(launch) {
  console.info('Submitting a new launch:', launch)
  const response = await fetch('http://localhost:8000/launches', { 
    method: 'POST', 
    body: JSON.stringify(launch), 
    headers: {
      'Content-Type': 'application/json'
    }
  })
  const addedLaunch = await response.json()
  console.info('Added launch:', addedLaunch)
  return response.ok
}

async function httpAbortLaunch(id) {
  console.info('Aborting launch...', id)
  const response = await fetch(`http://localhost:8000/launches/${id}`, { 
    method: 'DELETE'
  })
  const abortedLaunch = await response.json()
  console.info('Aborted launch:', abortedLaunch)
  return response.ok
}

export {
  httpGetPlanets,
  httpGetLaunches,
  httpSubmitLaunch,
  httpAbortLaunch,
};