const {User} = require('../models')

class UserController {
    static async register(req, res, next) {
        try {
            const { email, username, password } = req.body
            const newUser = await User.create({ email, username, password })

            res.status(201).json({
                id: newUser.id,
                username: newUser.username,
                email: newUser.email
            })
        } catch (error) {
            next(error)
        }
    }

    static async login(req, res, next) {
        try {
            
        } catch (error) {
            next(error)
        }
    }

}

module.exports = UserController