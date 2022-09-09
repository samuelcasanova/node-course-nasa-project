const { parse } = require('csv-parse')
const { createReadStream } = require('fs')
const path = require('path')
const planets = require('./planets.mongo')

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

async function processPlanet(planet) {
    if (isHabitablePlanet(planet)) {
        await planets.updateOne({
            keplerName: planet.kepler_name
        }, {
            keplerName: planet.kepler_name
        }, {
            upsert: true
        })
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
            .on('end', async () => {
                const planetsLength = (await planets.find({})).length
                console.info(`Finished processing planets CSV stream! Pre-fetched ${planetsLength} habitable planets.`)
                resolve(planets)
            })
    })
}

async function getPlanets() {
    return await planets.find({}, {
        _id: 0,
        __v: 0
    })
}

module.exports = {
    loadPlanetsData,
    getPlanets
}