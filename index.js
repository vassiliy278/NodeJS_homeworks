const {argv} = require('yargs')
const functionality = require('./contacts')

function invokeAction({ action, id, name, email, phone }) {
  switch (action) {
    case 'list':
        functionality.listContacts()
      break;

    case 'get':
        functionality.getContactById(id)
      break;

    case 'add':
        functionality.addContact(name, email, phone)
      break;

    case 'remove':
        functionality.removeContact(id)
      break;

    default:
      console.warn('\x1B[31m Unknown action type!');
      break
  }
}
invokeAction(argv)