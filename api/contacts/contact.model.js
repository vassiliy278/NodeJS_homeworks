const mongoose = require('mongoose')
const { Schema } = mongoose

const contactSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    }
})

const contactModel = mongoose.model('contact', contactSchema)

module.exports = contactModel