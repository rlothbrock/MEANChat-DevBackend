const morgan = require('morgan');
const helmet = require('helmet');
const express = require('express');
const xssClean = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const path = require('path');

const { wildcardHandler } = require('../utils/route tools/wildcard')
const { errHandler } = require('./err-global-middle');

module.exports = function(application){
    application.use(helmet());
    if (process.env.NODE_ENV === 'development'){application.use(morgan('dev'))};
    application.use('/api',require('./request-limit-middle'));
    application.use(express.json());
    application.use(express.static(path.join(__dirname,'../static')))
    application.use(mongoSanitize());
    application.use(xssClean());
    application.use(hpp());
    
    require('./routes')(application);
    application.use('*',wildcardHandler)
    application.use(errHandler) 
}

