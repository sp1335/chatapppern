const authService = require('../services/authService');
const bcrypt = require('bcrypt')

function storeAuthCookie(res, response) {
    const cookieAge = 1000 * 60 * 60 * 24
    const cookieConfig = {
        httpOnly: false,
        maxAge: cookieAge,
        sameSite: 'strict',
        secure: false
    }
    res.cookie('access_token', response.tokens.accessToken, cookieConfig)
    res.cookie('user_id', response.userDto.userid, cookieConfig)
    res.cookie('user_role', response.userDto.role, cookieConfig)
}
async function signin(req, res) {
    const { username, password } = req.body
    const response = await authService.signin(username, password)
    if (response && response.status === 200) { storeAuthCookie(res, response) }
    return res.status(response.status).json(response.message)
}
async function signup(req, res) {
    const { username, password, email } = req.body
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    const response = await authService.signup(username, hashedPassword, email)
    if (response && response.status === 200) { storeAuthCookie(res, response) }
    return res.status(response.status).json(response.message)
}
async function signout(req, res) {
    const { access_token } = req.cookies
    const response = await authService.signout(access_token)
    if(response&& response.status === 200){res.clearCookie('access_token');res.clearCookie('user_id');res.clearCookie('user_role');}
    return res.status(response.status).json(response.message)
}

module.exports = { signin, signup, signout };