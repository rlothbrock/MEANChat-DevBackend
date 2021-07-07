const express = require('express');
const app = express();

//middleware
require('./middleware/app-wide-middle')(app);



module.exports = app;

