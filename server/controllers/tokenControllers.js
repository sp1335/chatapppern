const tokenService = require('../services/tokenService');
function storeAuthCookie(res, response) {
    const cookieAge = 1000 * 60 * 60 * 24
    const cookieConfig = {
        httpOnly: false,
        maxAge: cookieAge,
        sameSite: 'strict',
        secure: false
    }
    res.cookie('access_token', response.access_token, cookieConfig)
}
async function verifyToken(req, res) {
    const { access_token, user_id } = req.cookies
    const response = await tokenService.verifyToken(access_token, user_id)
    if (response && response.status === 200) {
        const { message, user } = response
        res.status(response.status).json({ message, user })
    } else if (response && response.status === 201) {
        storeAuthCookie(res, response)
        const {message, user} = response
        res.status(response.status).json({message, user })
    } else {
        res.status(response.status).json(response.message)
    }
}
module.exports = { verifyToken };