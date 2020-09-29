const path = require('path')
const fs = require('fs')

const contactsPath = './db/contacts.json'

const parsed = JSON.parse(fs.readFileSync(contactsPath, 'utf-8'))

function listContacts() {
    console.log(parsed)
}
  
function getContactById(contactId) {
    console.log(parsed.filter(e => e.id === contactId))
}
  
function removeContact(contactId) {
    let tempRemove = parsed.filter(e => e.id !== contactId);
    fs.writeFile(contactsPath, JSON.stringify(tempRemove), err => {
      if(err) throw err;
      console.log(`remover contact with id:${contactId}`)
  })
}

function addContact(name, email, phone) {
    const newContact = {
        name: name,
        email: email,
        phone: phone
    }
    let temp = parsed;
    temp.push(newContact);
    fs.writeFile(contactsPath, JSON.stringify(temp), err => {
        if(err) throw err;
        console.log(`Added ${name}.`)
    })
}

module.exports.listContacts = listContacts;
module.exports.getContactById = getContactById;
module.exports.removeContact = removeContact;
module.exports.addContact = addContact;

