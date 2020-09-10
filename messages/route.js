const express = require('express');
const { getAllMessages, createMessage } = require('./controller');

const Router = express.Router();

Router
.route('/')
.get(getAllMessages)
.post(createMessage)

Router
.route('/:id')
.get()

module.exports = Router;