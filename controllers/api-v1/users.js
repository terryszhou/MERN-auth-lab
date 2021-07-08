// SETUP - - - - - - - - - - - - - - - - -
const router = require('express').Router()
const db = require('../../models')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const authLockedRoute = require('./authLockedRoute')

const log = console.log

// ROUTES - - - - - - - - - - - - - - - - -

// GET /users -- test api endpoint
router.get('/', (req, res) => {
    res.json({ msg: "Hello from Router Backend!" })
})

// POST /users/register -- CREATE/register a new user
router.post('/register', async (req, res) => {
    try {
        // 1. check user
        const findUser = await db.User.findOne({
            email: req.body.email
        })
        // 2. if (user), !register
        if (findUser) return res.status(400).json({ msg: "User already exists." })

        // 3. hash password from req.body
        const password = req.body.password
        const salt = 12
        const hashedPassword = await bcrypt.hash(password, salt)

        // 4. create new user
        const newUser = db.User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        })
        await newUser.save()

        // 5. create jwt payload
        const payload = {
            name: newUser.name,
            email: newUser.email,
            id: newUser.id
        }

        // 6. sign jwt, send response
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 60 * 60 })
        res.json({ token })

    } catch(err) {
        log(err)
        res.status(500).json({ msg: "Internal Server Error" })
    }
})

// POST /users/login -- validate login credentials
router.post('/login', async (req, res) => {
    try {
        // 1. find user in db
        const findUser = await db.User.findOne({
            email: req.body.email
        })

        const validFail = "Incorrect Username or Password"

        // 2. if (!user) go back
        if(!findUser) return res.status(400).json({ msg: validFail })

        // 3. check user's password
        const match = await bcrypt.compare(req.body.password, findUser.password)

        // 4. if !password go back
        if(!match) return res.status(400).json({ msg: validFail })

        // 5. create jwt payload
        const payload = {
            name: findUser.name,
            email: findUser.email,
            id: findUser.id
        }

        // 6. sign jwt, send response
        const token = await jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 60 * 60 })
        res.json({ token })

    } catch(err) {
        log(err)
        res.status(500).json({ msg: "Internal Server Error" })
    }
})

// GET /auth-locked -- redirect if bad jwt is found
router.get('/auth-locked', authLockedRoute, (req, res) => {
    log(res.locals.user)
    res.json({ msg: "AUTHORIZATION LOCKED" })
})

// EXPORT - - - - - - - - - - - - - - - - -
module.exports = router