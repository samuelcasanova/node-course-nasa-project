const mongoose = require('mongoose')

const MONGO_URL = 'mongodb+srv://nasa-api:peVTJtC50oSQGWBX@nodecourse-nasa.f7s4v3g.mongodb.net/?retryWrites=true&w=majority'

mongoose.connection.once('open', () => {
    console.log('Mongo connection is ready.')
})

mongoose.connection.on('error', (err) => {
    console.error(err)
})

async function mongoConnect() {
    return await mongoose.connect(MONGO_URL)
}

async function mongoDisconnect() {
    return await mongoose.disconnect()
}

module.exports = {
    mongoConnect,
    mongoDisconnect
}