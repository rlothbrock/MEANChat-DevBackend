const winston = require('winston');
require('winston-mongodb');

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: {service: 'user-service'},
    transports: [
        new winston.transports.File({filename: 'logs/combined.log' }),
        //new winston.transports.MongoDB({}) // for log errors on db
        new winston.transports.File({
            filename: 'logs/uncaught-exceptions.log',
            level:'error',
            handleExceptions: true,
            handleRejections: true
        }),

    ]
});


if (process.env.NODE_ENV !== 'production'){
    logger.add(new winston.transports.Console({
        level:'info',
        format: winston.format.simple(),
    }));

};
