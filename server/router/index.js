const Router = require('express').Router
const router = new Router()
const authService = require('../services/authService')
const chatService = require('../services/chatService')
const messageService = require('../services/messageService')
const tokenService = require('../services/tokenService')

router.post('/signin', authService.signin)
router.post('/signup', authService.signup)
router.post('/verifyToken', tokenService.verifyToken)
module.exports = router