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
    async deleteToken(req, res) {
        const { user_id } = req.body;
        const deleteTokensQuery = 'DELETE FROM public.tokens WHERE user_id = $1';
        const pool = new Pool(DB_CREDITS_PARSED);
        const client = await pool.connect();

        try {
            await client.query(deleteTokensQuery, [user_id]);
            return res.status(200).json({ message: 'Tokens deleted successfully' });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'Server Error' });
        } finally {
            client.release();
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
                try {
                    const decodedToken = jwt.verify(access_token, process.env.JWT_ACCESS_SECRET);
                } catch (error) {
                    if (error instanceof jwt.JsonWebTokenError) {
                        return res.status(496).json({ message: 'Invalid token.' });
                    } else if (error instanceof jwt.TokenExpiredError) {
                        return res.status(401).json({ message: 'Expired token.' });
                    } else {
                        return res.status(498).json({ message: 'Unknown token error.' });
                    }
                }
                if (actualToken === access_token) { return res.status(200).json({ message: 'Token validity confirmed!' }) }
                else { return res.status(401).json({ message: 'Unauthorized HTTP.' }) }
            }
        } catch (error) {
            res.status(500).json(error)
        } finally {
            client.release()
        }
    }
}
module.exports = new TokenService()