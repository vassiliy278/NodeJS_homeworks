const joi = require('joi')
const contactModel = require('./contact.model')
const { ObjectID } = require('mongodb')

class ContactController {
    validationContact (req, res, next) {
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
    async createContact(req, res, next) {
        try{
            const contact = await contactModel.create(req.body)
            return res.status(201).json(contact)
        } catch(err) {
            next(err)
        }
    }
    async listContacts (req, res, next) {
        try {
            const contacts = await contactModel.find()
            return res.status(200).json(contacts)
        } catch(err) {
            next(err)
        }
    }
    async getById (req, res, next) {
        try {
            const id = req.params.id
            const contact = await contactModel.findOne({_id: new ObjectID(id)})
             if (!contact) {
                return res.status(404).json({message: 'Not Found Contact'})
            }
            return res.status(200).json(contact)
    
        } catch(err) {
            next(err)
        }
    }
    async removeContact (req, res, next) {
        try {
            const id = req.params.id
            if (!ObjectID.isValid(id) || !id) {
                return res.status(404).json({message: 'Not Found'})
            }
            const contact = await contactModel.deleteOne({_id: new ObjectID(id)})
            return res.status(204).send('deleted')
    
        } catch(err) {
            next(err)
        }
    }
    async updateContact (req, res, next) {
        try {
            const id = req.params.id
            if(!ObjectID.isValid(id)) {
                return res.status(404).send({message: 'Not valid ID'})
            }
            if(!id) {
                return res.status(404).send({message: 'id missing'})
            }
            const updateContactResult = await contactModel.findByIdAndUpdate(
                id,
                {
                    $set: req.body
                },
                {
                    new: true
                }
            )
            return res.status(204).send('updated')
        }
        catch(err) {
            next(err)
        }
    }
    validateUpdateContact(req, res, next) {
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

}

module.exports = new ContactController