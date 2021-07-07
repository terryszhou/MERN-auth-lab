const bcrypt = require('bcryptjs')
const log = console.log

const cryptoTest = async () => {
    try {
        const password = 'hello'
        const salt = 12
        const hashedPassword = await bcrypt.hash(password, salt)
        log(hashedPassword)

        const match = await bcrypt.compare('hello', hashedPassword)
        log(`Match: ${match}`)

    } catch (err) {
        log(err)
    }
}

cryptoTest()