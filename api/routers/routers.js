
require('dotenv').config()

const bodyParser = require('body-parser')

const controllers = require('../controllers/controllers.js')

const express = require('express');

const router = express.Router();

router.use(bodyParser.json())

router.get('/contacts', controllers.listContacts);

router.get('/contacts/:contact', controllers.getById)

router.post('/contacts', controllers.validationContact, controllers.addContact)

router.delete('/contacts/:contact', controllers.removeContact)

router.patch('/contacts/:contact', controllers.checkEmptyBody, controllers.updateContact)

module.exports = router;