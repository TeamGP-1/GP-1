const express = require('express')
const router = express.Router()
const UserController = require('./controllers/userController')
const errorHandlers = require('../middlewares/errorHandlers')

router.post('/register', UserController.register)
router.post('/login', UserController.login)

router.use(errorHandlers)

module.exports = router