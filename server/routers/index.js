const express = require('express')
const router = express.Router()
const UserController = require('../controllers/userController')
// const {authentication, authorization} = require('../middlewares/auth')
const errorHandlers = require('../middlewares/errorHandlers')

router.post('/register', UserController.register)
router.post('/login', UserController.login)

// Not sure when we'll use this...
// router.use(authentication)

router.use(errorHandlers)

module.exports = router