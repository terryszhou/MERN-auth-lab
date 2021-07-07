const jwt = require('jsonwebtoken')
const log = console.log

const jwtTest = () => {
    try {
        // create the data payload
        const payload = {
            name: 'Terry',
            id: 5
        }

        // sign the jwt
        const token = jwt.sign(payload, 'This is my secret', { expiresIn: 60 * 60 })
        log(`Token: ${token}`)

        // request to server
        
        // decode the incoming jwt
        const decoded = jwt.verify(token, 'This is my secret')
        log(`Decoded Token: ${decoded}`)

    } catch (err) {
        log(err)
    }
}

jwtTest()