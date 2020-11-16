const usersModel = require('./users.model')
const bcrypt = require('bcrypt')
const saltRounds = 4

async function findUser(email) {
  return await usersModel.findOne({ email })
}

async function hashPassword(password) {
  return await bcrypt.hash(password, saltRounds)
}

async function updateToken(id, newToken) {
  return await usersModel.findByIdAndUpdate(id, { token: newToken })
}

module.exports = {
  findUser,
  hashPassword,
  updateToken
}