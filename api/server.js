const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()
const contactRouter = require('./contacts/contact.router')


const db = mongoose.connection;
db.on('error', () => {
    console.log("Connection Failed") 
    process.exit(1)
});
db.once('open', function() {
   console.log("Database connection successful") 
});


module.exports = class ContactsServer {
    constructor() {
        this.server = null
    }

    async start() {
        this.initServer()
        this.initMidWares()
        this.initRoutes()
        await this.initDB()
        this.startListening()
    }

    initServer() {
        this.server = express()
    }

    initMidWares() {
        this.server.use(express.json())
    }

    initRoutes() {
        this.server.use('/contacts', contactRouter)
    }

    async initDB() {
        await mongoose.connect(process.env.MONGODB_URL)

    }

    startListening() {
        this.server.listen(process.env.PORT, () => {
            console.log('Start Listening', process.env.PORT)
        })
    }
}
