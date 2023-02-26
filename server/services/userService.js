const {Pool} = require('pg')
const bcrypt = require('bcrypt')
const uuid = require('uuid')
const tokenService = require('./tokenService')
const pg = require('pg')
const pool = new Pool(process.env.)
class UserSevice {
    async signup(req, res, next){
        const candidate = req.body
        try {
            
        } catch (error) {
            console.log(error)
        }
    }
    async signin(req, res, next){
        try {
            res.send('signin')
        } catch (error) {
            console.log(error)
        }
    }
    async getUser(req, res, next){
        try {
            console.log(req)
            res.send('getUser')
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = new UserSevice()