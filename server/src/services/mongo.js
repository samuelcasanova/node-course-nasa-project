const mongoose = require('mongoose')

mongoose.connection.once('open', () => {
    console.log('Mongo connection is ready.')
})

mongoose.connection.on('error', (err) => {
    console.error(err)
})

async function mongoConnect() {
    return await mongoose.connect(process.env.MONGO_URL)
}

async function mongoDisconnect() {
    return await mongoose.disconnect()
}

module.exports = {
    mongoConnect,
    mongoDisconnect
}