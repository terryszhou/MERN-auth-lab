const mongoose = require('mongoose')
const log = console.log

const connect = () => {
    const MONGODB_URI = process.env.MONGODB_URI

    mongoose.connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    })

    const db = mongoose.connection
    db.once('open', () => log(`MongoDB connected at ${db.host}:${db.port}`))
    db.on('error', err => log(err))
}

module.exports = { connect }