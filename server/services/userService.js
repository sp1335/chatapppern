const { Pool } = require('pg')
const bcrypt = require('bcrypt')
const { v4: uuidv4 } = require('uuid')
const tokenService = require('./tokenService')
const { client } = require('websocket')
const DB_CREDITS_PARSED = JSON.parse(process.env.DB_CREDITS)
const pool = new Pool(DB_CREDITS_PARSED)

class UserSevice {
    async signup(req, res, next) {
        const { name, password, email } = req.body
        try {
            const client = await pool.connect()
            const checkQuery = 'SELECT COUNT(*) FROM public.user WHERE email = $1 OR name = $2'
            const candidateCheck = (await client.query(checkQuery, [email, name])).rows[0].count
            if (candidateCheck > 0) {
                res.status(409).error('Email or username already in use')
            } else {
                const userid = uuidv4()
                const salt = await bcrypt.genSalt(10)
                const hashedPassword = await bcrypt.hash(password, salt)
                const insertQuery = 'INSERT INTO public.user (user_id, name, email, password, role, photo_url, creation_date, last_activity) VALUES ($1,$2,$3,$4,4,1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)'
                await client.query(insertQuery,[ userid, name, email, hashedPassword])
                //tokens here
                res.status(200).json('Registered succesfully: tokens incoming')
            }
        } catch (error) {
            res.status(500).json(error)
        }finally{
            client.release()
        }
    }
    async signin(req, res, next) {
        try {
            res.send('signin')
        } catch (error) {
            console.log(error)
        }
    }
    async getUser(req, res, next) {
        try {
            console.log(req)
            res.send('getUser')
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = new UserSevice()