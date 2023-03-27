const userService = require('../services/userService');

async function fetchRoomList(req, res) {
    if (req.cookies !== '') {
        const { user_id, user_role, access_token } = req.cookies
        const response = await(userService.fetchUserRoomlist(user_id))
        if (response && response.status === 200) {
            const { rooms } = response
            res.status(response.status).json({ data: rooms })
        } else {
            res.status(response.status).json(response.message)
        }
    }
}


module.exports = { fetchRoomList };