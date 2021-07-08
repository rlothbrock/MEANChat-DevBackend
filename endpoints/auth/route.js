const express = require('express');
const {loginValidator} = require("../../core/middleware/req-validator");
const {signUpValidator} = require("../../core/middleware/req-validator");
const { signup, signin } = require('./handler');
const { passwordForgotten, passwordRecovery } = require('../../core/middleware/route-guard');


const route = express.Router();


route
.route('/new-user')
.post(signUpValidator,signup)

route
.route('/login')
.post(loginValidator,signin)

route
.route('/recovery')
.post(passwordForgotten)

route
.route('/reset-password/:token')
.patch(passwordRecovery)


module.exports = route;
