const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const converter = require('../file-service/file-services');
const userValidation = require('../validation/user.validation');
const tokenSecret = process.env.TOKEN_SECRET || "tokensecret";
const log4js = require("../utils/logger");
const log = log4js.getLogger();


class UserControllers {
    async register(req, res) {
        try {
            const { username, email, password, bio } = req.body;
            userValidation.validateUser(email, password, username);
            const existingEmail = await User.findOne({ email: email })
            if (existingEmail)
                throw new Error(`Account with following email ${email} already exists`)
            log.error(`Typed existing email during registration`)
            const existingUsername = await User.findOne({ username: username });
            if (existingUsername)
                throw new Error(`account with following username ${username} already exists`)
            log.error(`Typed existing username during registration`)
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            const photo = converter.saveFile(req.files.image)
            const newUser = new User({
                username,
                email,
                password: hashedPassword,
                image: photo,
                bio
            })
            newUser.save();
            const id = newUser._id
            const token = jwt.sign({ username, id }, tokenSecret)
            res.status(200).json({ info: newUser, token: token })
            log.info('New User created')
        } catch (err) {
            res.status(400).json({ msg: err.message })
            log.error({ msg: err.message })
        }
    }
    async login(req, res) {
        try {
            const { email, password, username } = req.body;
            userValidation.validateUser(email, password, username);
            const user = await User.findOne({ email: email })
            if (!user) {
                throw new Error(`No account with following email ${email} was found`)
                log.error(`Incorrect email during login`)
            }
            const usernameCheck = await User.findOne({ username: username })
            if (!usernameCheck) {
                throw new Error(`No account with following username ${username} was found`)
                log.error(`Incorrect username during login`)
            }
            const validPass = await bcrypt.compare(password, user.password);
            if (!validPass) {
                await User.findOneAndUpdate({ email: email }, {
                    unsuccessful_login: Date.now()
                })
                throw new Error({ msg: "Password is incorrect" })
                log.error(`Incorrect password during login`)
            }
            const token = jwt.sign({ _id: user._id, username: username }, tokenSecret);
            res.header('auth-token', token);
            if (user && validPass) {
                res.status(200).json({ username: username, email: email, last_login: user.last_login, unsuccessful_login: user.unsuccessful_login, token: token })
                await User.findOneAndUpdate({ email: email }, {
                    last_login: Date.now()
                })
            }
            log.info(`User ${username} logged in succesfully`)
        } catch (err) {
            res.status(400).json({ error: err.message });
            log.error({ msg: err.message })
        }
    }
    async update(req, res) {
        try {
            const { username, email, bio } = req.body;
            const { id } = req.params;
            const photo = converter.saveFile(req.files.image)
            await User.findByIdAndUpdate({ _id: id }, {
                username,
                email,
                bio,
                image: photo,
                last_update: Date.now()
            })
            log.info(`User ${username} updated his data succesfully`)
            res.status(200).json(true)

        } catch (err) {
            res.status(400).json(false);
            log.error({ msg: err.message })
        }
    }
    async forgotPassword(req, res) {
        try {
            const { password } = req.body;
            const { id } = req.params;
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            const user = await User.findByIdAndUpdate({ _id: id }, {
                password: hashedPassword,
                last_update: Date.now()
            })
            const token = jwt.sign({ _id: user._id, username: user.username }, tokenSecret);
            res.header('auth-token', token);
            res.status(200).json({ true: true, token: token })
        } catch (err) {
            res.status(400).json(false);
        }
    }
}

module.exports = new UserControllers();