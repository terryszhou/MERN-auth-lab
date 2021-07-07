// SETUP - - - - - - - - - - - - - - - - -
const router = require('express').Router()
const db = require('../../models')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const log = console.log

// ROUTES - - - - - - - - - - - - - - - - -

// GET /users -- test api endpoint
router.get('/', (req, res) => {
    res.json({ msg: "Hello from Router Backend!" })
})

// POST /users/register -- CREATE/register a new user
router.post('/register', async (req, res) => {
    try {
        // check user
        const findUser = await db.User.findOne({
            email: req.body.email
        })
        // if (user), !register
        if (findUser) return res.status(400).json({ msg: "User already exists." })

        // hash password from req.body
        const password = req.body.password
        const salt = 12
        const hashedPassword = await bcrypt.hash(password, salt)

        // create new user
        const newUser = db.User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        })
        await newUser.save()

        // create jwt payload
        const payload = {
            name: newUser.name,
            email: newUser.email,
            id: newUser.id
        }

        // sign jwt, send response
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
        // find user in db
        const findUser = await db.User.findOne({
            email: req.body.email
        })

        const validFail = "Incorrect Username or Password"

        // if (!user) go back
        if(!findUser) return res.status(400).json({ msg: validFail })

        // check user's password
        const match = await bcrypt.compare(req.body.password, findUser.password)

        // if !password go back
        if(!match) return res.status(400).json({ msg: validFail })

        // create jwt payload
        const payload = {
            name: findUser.name,
            email: findUser.email,
            id: findUser.id
        }

        // sign jwt, send response
        const token = await jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 60 * 60 })
        res.json({ token })

    } catch(err) {
        log(err)
        res.status(500).json({ msg: "Internal Server Error" })
    }
})


// GET /auth-locked -- redirect if bad jwt is found



// EXPORT - - - - - - - - - - - - - - - - -
module.exports = router