const request = require('supertest')
const app = require('../../app')
const { getLaunches, saveLaunch, abortLaunch, loadLaunchesData } = require('../../models/launches.model')
const { loadPlanetsData } = require('../../models/planets.model')
const { mongoConnect, mongoDisconnect } = require('../../services/mongo')
console.log(require('dotenv').config())

describe('TESTS', () => {
    beforeAll(async () => {
        await mongoConnect()
        await loadPlanetsData()
        await loadLaunchesData()
    })

    describe('UNIT TESTS', () => {
        describe('Launches', () => {
            it('should get some launches on getLaunches', async () => {
                const launches = await getLaunches()
                
                expect(launches.length).toBeGreaterThan(0)
            })

            it('should save a launch', async () => {
                const launchToBeSaved = {
                    mission: 'Kepler exploration X',
                    rocket: 'Explorer IS 1',
                    launchDate: new Date('2030/08/01'),
                    target: 'Kepler-296 f'
                }

                await saveLaunch(launchToBeSaved)
                const allLaunches = await getLaunches()

                expect(allLaunches.some(launch => launch.mission === launchToBeSaved.mission)).toBe(true)
            })

            it('should abort a launch', async () => {
                const launchToBeAborted = {
                    flightNumber: 999999,
                    mission: 'Kepler exploration X',
                    rocket: 'Explorer IS 1',
                    launchDate: new Date('2030/08/01'),
                    target: 'Kepler-296 f'
                }
                await saveLaunch(launchToBeAborted)
                                
                await abortLaunch(999999)
                
                const allLaunches = await getLaunches()
                const abortedLaunch = allLaunches.find(launch => launch.flightNumber === 999999)
                expect(abortedLaunch.success).toBeFalsy()
                expect(abortedLaunch.upcoming).toBeFalsy()
            })
        })
    })
    
    describe('INTEGRATION TESTS', () => {
        describe('Launches', () => {
            it('should get 1 launch on GET launches', async () => {
                await request(app)
                    .get('/v1/launches')
                    .expect('Content-Type', /application\/json/)
                    .expect(200)
            })
        })
    })
    
    afterAll(async () => {
        await mongoDisconnect()
    })
})

