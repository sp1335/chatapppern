const Router = require('express').Router
const router = new Router()
// controllers
const authControllers = require('../controllers/authControllers')
const tokenControllers = require('../controllers/tokenControllers')
const userController = require('../controllers/userController')

router.post('/signin',  authControllers.signin)
router.post('/signup', authControllers.signup)
router.post('/signout', authControllers.signout)
router.post('/verifyToken', tokenControllers.verifyToken)
router.get('/fetchRoomList', userController.fetchRoomList)
module.exports = router