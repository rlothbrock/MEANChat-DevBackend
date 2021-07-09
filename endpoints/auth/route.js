const express = require('express');
const {passwordRecovery} = require("./controller");
const {passwordForgotten} = require("./controller");
const {loginValidator} = require("../../core/middleware/req-validator");
const {signUpValidator, paramValidator} = require("../../core/middleware/req-validator");
const { signup, signin } = require('./controller');


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
.patch(paramValidator,passwordRecovery)


module.exports = route;
