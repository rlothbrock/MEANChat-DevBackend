const express = require('express');
const { getRoom, createRoom, getAllRooms } = require('./controller');

const Router = express.Router();

Router
.route('/')
.get(getAllRooms)
.post(createRoom)

Router
.route('/:id')
.get(getRoom)


module.exports = Router;