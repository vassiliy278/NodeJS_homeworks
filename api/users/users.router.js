const { Router } = require('express')
const UsersController = require('./users.controller')
const usersRouter = Router()

usersRouter.post('/auth/register', UsersController.validateUser, UsersController.registerUser);
  
usersRouter.post('/auth/login', UsersController.validateUser, UsersController.loginUser);

usersRouter.post('/auth/logout', UsersController.authorize, UsersController.logoutUser);

usersRouter.get('/users/current', UsersController.authorize, UsersController.getCurrentUser);

module.exports = usersRouter;