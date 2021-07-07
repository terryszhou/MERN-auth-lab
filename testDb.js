require('dotenv').config()
const db = require('./models')
db.connect()
const log = console.log

const dbTest = async () => {
    try {

        const newUser = new db.User({
            name: "Oliver Cromwell",
            email: "o@c.com",
            password: "oliver"
        })
        await newUser.save()
        log(`New user: ${newUser}`)

        const foundUser = await db.User.findOne({
            name: "Oliver Cromwell"
        })
        log(`Found user: ${foundUser}`)

    } catch (err) {
        log(err)
    }
}

dbTest()
