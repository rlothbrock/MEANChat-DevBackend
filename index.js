
require('./utils/error.handling/unc-except-logger');
const dotenv = require('dotenv');
dotenv.config({path: './config.env'});
const app = require('./app');
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const { socketConfig } = require('./socket-config');
require('./db-connection');
const PORT  = process.env.PORT || 3000;
io.on('connection',socketConfig);



http.listen(PORT,()=>console.log(`running ${process.env.NODE_ENV} server on port ${PORT}...` ));




