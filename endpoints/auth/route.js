const express = require('express');
const { bodyValidator } = require('../../core/middleware/body-validator');
const { signup, signin } = require('./handler');
const { passwordForgotten, passwordRecovery } = require('../../core/middleware/route-guard-middle');


const route = express.Router();


route
.route('/new-user')
.post(bodyValidator({}),signup)

route
.route('/login')
.post(bodyValidator({}),signin)

route
.route('/recovery')
.post(bodyValidator({}), passwordForgotten)

route
.route('/reset-password/:token')
.patch(passwordRecovery)


module.exports = route;
