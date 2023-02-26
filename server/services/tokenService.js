const jwt = require('jsonwebtoken')
class TokenService{
    constructor(db){
        this.db = db;
    }
    generateTokens(payload){
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET,  {expiresIn:'30m'})
        const refreshToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: '30d'})
        return {
            accessToken,refreshToken
        }
    }
    async saveToken(user_id, refreshToken){
        //TODO generate tokens
    }
}
module.exports = new TokenService()