const express = require('express');
const app = express();

//middleware
require('./middleware/app-wide')(app);



module.exports = app;

