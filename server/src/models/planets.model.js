const { parse } = require('csv-parse')
const { createReadStream } = require('fs')
const path = require('path')

const planets = []

const parser = parse({
    comment: '#',
    columns: true,
})

function isHabitablePlanet(planet) {
    return planet['koi_disposition'] === 'CONFIRMED' 
        && planet['koi_insol'] > 0.36 
        && planet['koi_insol'] < 1.11 
        && planet['koi_prad'] < 1.6
}

function processPlanet(planet) {
    if (isHabitablePlanet(planet)) {
        planets.push(planet)
    }
}

function loadPlanetsData() {
    const parser = parse({
        comment: '#',
        columns: true,
    })
    return new Promise((resolve, reject) => {
        createReadStream(path.join(__dirname, '..', '..', 'data', 'kepler_data.csv'))
            .pipe(parser)
            .on('data', (data) => {
                processPlanet(data)
            })
            .on('error', (error) => {
                console.error(error)  
                reject(error)
            })
            .on('end', () => {
                console.info(`Finished! Found ${planets.length}`)
                resolve(planets)
            })
    })
}

module.exports = {
    loadPlanetsData,
    planets
}