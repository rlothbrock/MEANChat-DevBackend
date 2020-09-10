const express = require('express');
const Router = express.Router();
const {getAllUsers} = require('./controller');

Router
.route('/')
.get(getAllUsers)


module.exports = Router;