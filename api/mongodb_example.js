const express = require('express')
const mongodb = require('mongodb')
const joi = require('joi')
const { MongoClient, ObjectID } = mongodb
const PORT = 3000
const DB_NAME = 'db_contacts'
let db, contactsCollection
const MONGODB_URL = `mongodb+srv://vassiliy:3KxscAHwIQ2afTtd@cluster0.tcyqc.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`



async function main() {
    const server = express()
    server.use(express.json())
    const client = await MongoClient.connect(MONGODB_URL)

    db = client.db(DB_NAME)

    contactsCollection = db.collection('contacts')

    server.post('/contacts', validationContact, createContact)
    server.get('/contacts', listContacts)
    server.get('/contacts/:id', getById)
    server.delete('/contacts/:id', removeContact)
    server.put('/contacts/:id', validateUpdateContact, updateContact)

    server.listen(PORT, () => {
        console.log('Server listen on port', PORT)
    })
}

const validationContact = (req, res, next) => {
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
        next()
    }
}

async function createContact(req, res, next) {
    try {
        const newContact = await contactsCollection.insert(req.body)
        return res.status(201).json(newContact.ops)
    } catch(err) {
        next(err)
    }
    
    next()
}
async function listContacts (req, res, next) {
    try {
        const contacts = await contactsCollection.find({}).toArray()
        return res.status(200).json(contacts)
    } catch(err) {
        next(err)
    }
}
async function getById (req, res, next) {
    try {
        const id = req.params.id
        const contact = await contactsCollection.findOne({_id: id})
        console.log(contact)
        if (!ObjectID.isValid(id)) {
            return res.status(404).json({message: 'Not Found'})
        }
        if (!id) {
            return res.status(404).json({message: 'Not Found'})
        }
        if (!contact) {
            return res.status(404).json({message: 'Not Found'})
        }
        return res.status(200).json(contact)

    } catch(err) {
        next(err)
    }
}
async function removeContact (req, res, next) {
    try {
        const id = req.params.id
        if (!ObjectID.isValid(id) || !id) {
            return res.status(404).json({message: 'Not Found'})
        }
        let contactName = await contactsCollection.findOne({_id: new ObjectID(id)})
        const contact = await contactsCollection.remove({_id: new ObjectID(id)})
        if (!contactName) {
            return res.status(404).json({message: 'Not Found'})
        }
        return res.status(204).json({message: `removed ${contactName.name}`})

    } catch(err) {
        next(err)
    }
}

function validateUpdateContact(req, res, next) {
    const createContactRules = joi.object({
        name: joi.string(),
        email: joi.string(),
        phone: joi.string()
    })
    const validated = createContactRules.validate(req.body)
    if(validated.error) {
        const arrWarn = validated.error.details[0].message
        res.status(400).send({"message": arrWarn})
    } else {
        next()
    }
}
function checkEmptyBody (req, res, next) {
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

async function updateContact (req, res, next) {
    try {
        const id = req.params.id
        if(!ObjectID.isValid(id)) {
            return res.status(404).send({message: 'Not valid ID'})
        }
        if(!id) {
            return res.status(404).send({message: 'id missing'})
        }
        const updateContactResult = await contactsCollection.updateOne({
            _id: new ObjectID(id)
        },
        {
            $set: req.body,
        })
        // if(!updateContactResult.modifiedCount) {
        //     return res.status(404).send({message: 'Nothing change'})
        // }
        return res.status(204).send()
    }
    catch(err) {
        next(err)
    }
}

main()