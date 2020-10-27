
const joi = require('joi')

const contacts = require('./db/contacts.json')

module.exports = class Controllers {
    constructor() {

    }

    static listContacts = (req, res, next) => {
        res.json(contacts)
    }
    
    static getById = (req, res, next) => {
        const id = Number(req.params.contact)
        const filteredContacts = contacts.filter(e => e.id === id)
        if(filteredContacts.length !== 0)
            {res.status(200).json(filteredContacts)}
        else(res.status(404).json({"message": "Not found"}))
    }

    static addContact = (req, res, next) => {
        const newContact = {
            id: contacts.length+1,
            ...req.body
        }
        contacts.push(newContact)
        console.log('array', contacts)
        return res.status(201).send(newContact)
    }

    static removeContact = (req, res, next) => {
        const id = Number(req.params.contact)
        const findedContact = contacts.filter(e => e.id === id)
        if(findedContact.length === 0) {
            res.status(404).send({"message": "Not found"})
        } else {
            const index = contacts.indexOf(findedContact[0])
            contacts.splice(index, 1)
            res.status(200).send({"message": "contact deleted"})
        }
        
        console.log(contacts)
        next()
    }

    static validationContact = (req, res, next) => {
        const createContactRules = joi.object({
            name: joi.string().required(),
            email: joi.string().required(),
            phone: joi.string().required()
        })
        const validated = createContactRules.validate(req.body)
        if(validated.error) {
            const arrWarn = validated.error.details[0].message
            res.status(400).send({"message": arrWarn})
        } else {
            console.log('good')
            next()
        }
    }

    static checkEmptyBody = (req, res, next) => {
        function isEmpty(obj) {
            for(var key in obj) {
                if(obj.hasOwnProperty(key))
                    return false;
            }
            return true;
        }
        if(isEmpty(req.body)) {
            res.status(400).json({"message": "missing fields"})
            return
        } else (next())
    }

    static updateContact = (req, res, next) => {
        const id = Number(req.params.contact)
        const contactIndex = contacts.findIndex(e => e.id === id)
        const currentArr = contacts[contactIndex]
        if(contactIndex === -1) {
            res.send({"message": "not found"})
        } else {
            const {name, email, phone} = req.body
            console.log(req.body)
            if(!name) {
                currentArr.name = currentArr.name
            } else{currentArr.name = name}
            if(!email) {
                currentArr.email = currentArr.email
            } else{currentArr.email = email}
            if(!phone) {
                currentArr.phone = currentArr.phone
            } else{currentArr.phone = phone}
            res.json(contacts[contactIndex])
        }
        console.log(contacts)
        next()
    }
}
