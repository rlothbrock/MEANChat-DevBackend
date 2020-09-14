const winston = require('winston');

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: {service: 'user-service'},
    transports: [
        new winston.transports.File({filename: 'logs/combined.log' })
    ],
    exceptionHandlers:[
        new winston.transports.File({filename: 'logs/uncaught-exceptions.log'})
    ],
    rejectionHandlers:[
        new winston.transports.File({filename: 'logs/unhandled-rejections.log'})
    ]
});

if (process.env.NODE_ENV !== 'production'){
    logger.add(new winston.transports.Console({
        level:'info',
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
        ), 
        handleExceptions: true,
        handleRejections: true
    }))
};

process.on('uncaughtException',()=>{
    process.exit(1)
});
process.on('unhandledRejection',()=>{
    process.exit(1)
})