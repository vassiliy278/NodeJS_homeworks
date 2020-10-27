const express = require('express')

const cors = require('cors')

const server = express()

require('dotenv').config()

const router = require('./routers/routers')

server.get('/', cors({origin: `http://loclhost:${process.env.PORT}`}))

server.use('/api/', router)

server.listen(process.env.PORT, () => {
    console.log('server listen on port', process.env.PORT)
})