const express = require('express')

const server = express()

require('dotenv').config()

const router = require('./routers')

server.use('/api/', router)

server.listen(process.env.PORT, () => {
    console.log('server listen on port', process.env.PORT)
})