const bcrypt = require('bcryptjs')

const hashPassword = (password) => {
    const salt = bcrypt.genSaltSync(10)
    return bcrypt.hashSync(password, salt)
}

const comparePassword = (password, hashedPass) => {
    return bcrypt.compareSync(password, hashedPass)
}

module.exports = { hashPassword, comparePassword }