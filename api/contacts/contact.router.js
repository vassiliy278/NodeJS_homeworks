const { Router } = require('express')
const ContactController = require('./contact.controller')

contactRouter = Router()

contactRouter.post('/', ContactController.validationContact, ContactController.createContact)
contactRouter.get('/', ContactController.listContacts)
contactRouter.get('/:id', ContactController.getById)
contactRouter.delete('/:id', ContactController.removeContact)
contactRouter.put('/:id', ContactController.validateUpdateContact, ContactController.updateContact)

module.exports = contactRouter