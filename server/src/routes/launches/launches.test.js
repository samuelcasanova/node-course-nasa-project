const { getLaunches } = require('../../models/launches.model')
const request = require('supertest')
const app = require('../../app')


describe('UNIT TESTS', () => {
    describe('Launches', () => {
        it('should get launch 100 on getLaunches', () => {
            const launches = getLaunches()
            
            expect(launches[0].flightNumber).toBe(100)
        })
    })
})

describe('INTEGRATION TESTS', () => {
    describe('Launches', () => {
        it('should get 1 launch on GET launches', async () => {
            const response = await request(app)
                .get('/launches')
                .expect('Content-Type', /application\/json/)
                .expect(200)
        })
    })
})