const express = require('express')
const router = express.Router()
const { UserController } = require('../controllers')
const { authentication } = require('../middlewares/auth')

router.post('/register', UserController.register)
router.post('/login', UserController.login)
router.post('/login/google', UserController.gSign)

router.use(authentication)
router.get('/profile', UserController.profile)
router.get('/invitations', UserController.showInvitations)
module.exports = router