const Joi = require('joi')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const usersModel = require('./users.model')
const { hashPassword, findUser, updateToken } = require('./users.helpers')
require('dotenv').config()

class UsersControllers {
  static async registerUser(req, res, next) {
    try {
      const { email, password } = req.body
      const userExsist = await findUser(email)
      if (!userExsist) {
        const newUser = await usersModel.create({
            email,
            password: await hashPassword(password),
        })
        return res.status(201).json({
          user: {
            email: newUser.email,
            subscription: newUser.subscription,
          },
        })
      }
      return res.status(409).json({ message: 'Email already exist' })
    } 
    catch (error) {
      next(error);
    }
  }

  static async loginUser(req, res, next) {
    try {
      const { email, password } = req.body
      const user = await findUser(email)
      if (!user) {
        return res.status(401).json({ message: 'Email or password is wrong' })
      }
      const passwordMatch = await bcrypt.compare(password, user.password)
      if (!passwordMatch) {
        return res.status(401).json({ message: "Email or password is wrong" })
      }
      const token = await jwt.sign(
        { id: user._id },
        process.env.JWT_SECURE_KEY,
        { expiresIn: 2 * 24 * 60 * 60 }
      )

    updateToken(user._id, token)

    return res.status(200).json({
        token: token,
        user: {
          email: user.email,
          subscription: user.subscription,
        },
      })
    } 
    catch (error) {
      next(error)
    }
  }

  static async logoutUser(req, res, next) {
    try {
      const user = req.user;
      updateToken(user._id, null)
      return res.status(204).json()
    } 
    catch (error) {
      next(error)
    }
  }

  static async getCurrentUser(req, res, next) {
    try {
      const user = req.user
      return res.status(200).json({
        email: user.email,
        subscription: user.subscription,
      })
    } 
    catch (error) {
      next(error)
    }
  }

  static async authorize(req, res, next) {
    try {
      const authorizationHeader = req.get('Authorization');
      const token = authorizationHeader.replace('Bearer', '')
      let userId;
      try {
        userId = await jwt.verify(token, process.env.JWT_SECURE_KEY).id;
      } catch (err) {
        return res.status(401).json({ message: 'Not authorized' })
      }
      const user = await usersModel.findById(userId);
      if (!user || user.token !== token) {
        return res.status(401).json({ message: 'Not authorized' })
      }
      req.user = user
      req.token = token
      next()
    } catch (error) {
      next(error);
    }
  }

static validateUser(req, res, next) {
    const createContactRules = Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required(),
    })
    const result = createContactRules.validate(req.body)
    if (result.error) {
        return res.status(400).send('hope', result.error.details)
    }
    next()
  }
}
module.exports = UsersControllers