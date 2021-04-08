const User = require('../models/user')

class UserValidation {
    validateUser(email, password, username) {
        if (!email || !username || !password)
            throw new Error("You didnt fill all inputs")
    }
}

module.exports = new UserValidation();