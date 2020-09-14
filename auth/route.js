const express = require('express');
const { bodyValidator } = require('../middleware/body-validator');
const { signup, signin } = require('./handler');
const { User, joiSchema } = require('../users/schema');
const { passwordForgotten, passwordRecovery } = require('../middleware/route-guard-middle');

const router = express.Router();


router
.route('/new-user')
.post(bodyValidator(joiSchema),signup)

router
.route('/login')
.post(bodyValidator(joiSchema),signin)

router
.route('/recovery')
.post(bodyValidator(joiSchema), passwordForgotten)

router
.route('/reset-password/:token')
.patch(passwordRecovery)


module.exports = router;