// this endpoints are not yet implemented
const express = require('express');
const { getAllMessages} = require('./controller');

const Router = express.Router();

Router
.route('/')
.get(getAllMessages)

Router
.route('/:id')

module.exports = Router;
