const Router = require('express').Router
const router = new Router()
const userService = require('../services/userService')
const chatService = require('../services/chatService')
const messageService = require('../services/messageService')


router.post('/signin',userService.signin)                                 
router.post('/signup', userService.signup)                      
router.get('/getUser/:userId',userService.getUser)  
module.exports = router