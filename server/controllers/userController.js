const { comparePassword } = require('../helpers/bcrypt')
const { signToken } = require('../helpers/jwt')
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
            const { email, password } = req.body;

            if (!email) throw { name: "NoEmail" };
            if (!password) throw { name: "NoPassword" };

            const user = await User.findOne({
                where: { email }
            });

            if (!user) throw { name: "LoginError" };

            if (!comparePassword(password, user.password)) {
                throw { name: "LoginError" }
            };

            const payload = { // Data to be stored
                id: user.id,
                email: user.email
            };

            const access_token = signToken(payload);

            res.status(200).json({ access_token });
        } catch (error) {
            next(error);
        }
    }

}

module.exports = UserController