const request = require('supertest')
const app = require('../../app')
const { getLaunches, saveLaunch, abortLaunch } = require('../../models/launches.model')
const { loadPlanetsData } = require('../../models/planets.model')
const { mongoConnect, mongoDisconnect } = require('../../services/mongo')
require('dotenv').config()


describe('TESTS', () => {
    beforeAll(async () => {
        await mongoConnect()
        await loadPlanetsData()
    })

    describe('UNIT TESTS', () => {
        describe('Launches', () => {
            it('should get launch 100 on getLaunches', async () => {
                const launches = await getLaunches()
                const containsLaunch100 = launches.some(launch => launch.flightNumber === 100)
                
                expect(containsLaunch100).toBeTruthy()
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
                await abortLaunch(100)
                const allLaunches = await getLaunches()
                const abortedLaunch = allLaunches.find(launch => launch.flightNumber === 100)

                expect(abortedLaunch.success).toBeFalsy()
                expect(abortLaunch.upcoming).toBeFalsy()
            })
        })
    })
    
    describe('INTEGRATION TESTS', () => {
        describe('Launches', () => {
            it('should get 1 launch on GET launches', async () => {
                const response = await request(app)
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

