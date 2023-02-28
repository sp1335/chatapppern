const jwt = require('jsonwebtoken')
const { Pool } = require('pg')
const DB_CREDITS_PARSED = JSON.parse(process.env.DB_CREDITS)

class TokenService {
    generateTokens(payload) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: '30m' })
        const refreshPayload = { "userid": payload.userid, "tokentype": "refresh" }
        const refreshToken = jwt.sign(refreshPayload, process.env.JWT_ACCESS_SECRET, { expiresIn: '30d' })
        const tokens = { accessToken, refreshToken }
        try {
            this.storeTokens(payload, tokens)
        } catch (error) {
            return error
        }
        return tokens
    }
    async storeTokens(user, tokens) {
        const userid = user.userid
        const checkTokensQuery = 'SELECT * FROM public.tokens WHERE user_id = $1'
        const pool = new Pool(DB_CREDITS_PARSED)
        const client = await pool.connect()
        const ifTokenExists = await client.query(checkTokensQuery, [userid])
        let exeQuery
        if (ifTokenExists.rowCount === 0) {
            exeQuery = 'INSERT INTO public.tokens (user_id, access_token, refresh_token) VALUES ($1,$2,$3)'
            try {
                await client.query(exeQuery, [userid, tokens.accessToken, tokens.refreshToken])
            } catch (error) {
                console.log(error)
            } finally {
                client.release()
            }
        } else {
            exeQuery = 'UPDATE public.tokens SET access_token = $1, refresh_token = $2'
            try {
                await client.query(exeQuery, [tokens.accessToken, tokens.refreshToken])
            } catch (error) {
                console.log(error)
            } finally {
                client.release()
            }
        }
    }
    async verifyToken(req, res) {
        const { access_token, user_id } = req.body
        const checkTokensQuery = 'SELECT * FROM public.tokens WHERE user_id = $1'
        const pool = new Pool(DB_CREDITS_PARSED)
        const client = await pool.connect()
        try {
            const checkToken = await client.query(checkTokensQuery, [user_id])
            if (checkToken.rowCount !== 0) {
                const actualToken = checkToken.rows[0].access_token
                if (access_token === actualToken) {
                    if (jwt.decode(actualToken).exp < Date.now() / 1000) { res.status(498).json({message:'Token expired'})}
                    else{res.status(200).json({message:'Token ok'})}
                } else {
                    res.status(498).json('Invalide token')
                }
            }
        } catch (error) {
            console.log(error)
            res.status(500).json(error)
        }
    }
}
module.exports = new TokenService()