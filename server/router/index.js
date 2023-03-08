const Router = require('express').Router
const router = new Router()
// controllers
const authControllers = require('../controllers/authControllers')
const tokenControllers = require('../controllers/tokenControllers')
const userService = require('../services/userService')


router.post('/signin',  authControllers.signin)
router.post('/signup', authControllers.signup)
router.post('/signout', authControllers.signout)
router.post('/verifyToken', tokenControllers.verifyToken)
router.post('/fetchRoomList', userService.fetchUserRoomlist)

module.exports = router