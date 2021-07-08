const jwt = require('jsonwebtoken')
const db = require('../../models')

const log = console.log

const authLockedRoute = async (req, res, next) => {
    try {
        // 1. get jwt from authorization headers
        const authHeaders = req.headers.authorization

        // 2. verify jwt; if jwt !valid, throw catch
        const decoded = jwt.verify(authHeaders, process.env.JWT_SECRET)

        // 3. find db.user
        const findUser = await db.User.findById(decoded.id)

        // 4. mount user on res.locals
        res.locals.user = findUser
        next()

    } catch(err) {
        log(err)
        res.status(401).json({ msg: `You aren't allowed to be here!` })
    }
}

module.exports = authLockedRoute