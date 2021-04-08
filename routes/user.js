const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');


router.route('/register')
    .post(userController.register);

router.route('/login')
    .patch(userController.login)

router.route('/update/:id')
    .put(userController.update)

router.route('/forgot/:id')
    .patch(userController.forgotPassword)

module.exports = router;