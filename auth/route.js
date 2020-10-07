const express = require('express');
const { bodyValidator } = require('../middleware/body-validator');
const { signup, signin } = require('./handler');
const { User, joiSchema } = require('../users/schema');
const { passwordForgotten, passwordRecovery } = require('../middleware/route-guard-middle');


const route = express.Router();


route
.route('/new-user')
.post(bodyValidator(joiSchema),signup)

route
.route('/login')
.post(bodyValidator(joiSchema),signin)

route
.route('/recovery')
.post(bodyValidator(joiSchema), passwordForgotten)

route
.route('/reset-password/:token')
.patch(passwordRecovery)


module.exports = route;