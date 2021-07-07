// MODULE, CONST SETUP - - - - - - - - - - - - - - - - -
require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const rowdy = require('rowdy-logger')
const rowdyResults = rowdy.begin(app)

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())

const PORT = process.env.PORT || 3001
const log = console.log

// ROUTES - - - - - - - - - - - - - - - - -
app.get('/', (req, res) => {
    res.json({ msg: "Hello from the backend!" })
})


// LISTEN - - - - - - - - - - - - - - - - -
app.listen(PORT, () => {
    rowdyResults.print()
    log(`Listening on Port ${PORT}`)
})
