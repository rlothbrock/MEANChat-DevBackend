const express = require('express');
const { signup, signin } = require('./handler');
const { passwordForgotten, passwordRecovery } = require('../../core/middleware/route-guard-middle');


const route = express.Router();


route
.route('/new-user')
.post(signup)

route
.route('/login')
.post(signin)

route
.route('/recovery')
.post(passwordForgotten)

route
.route('/reset-password/:token')
.patch(passwordRecovery)


module.exports = route;
