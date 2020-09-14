const express = require('express');
const mongoose = require('mongoose');

const app = require('./app');
const http = require('http').createServer(app);
const io = require('socket.io')(http);

 
process.on('uncaughtException', (error)=>{
    console.log(error.name, error.message) // define here an efficient error notification
    console.log('complete log',error)
    console.log('uncaught exception: shutting down...');
        process.exit(1)
});

const dotenv = require('dotenv');
dotenv.config({path: './config.env'});


function connectionHandler(socket){
    console.log('a user connected...')
    console.log(socket.id);
    socket.on('disconnect',(reason)=>{
        console.log(`the user ${socket.id} has left the chat due  ${reason}`);
    })

    socket.on('ping',()=>{
        console.log('pong emitted')
        socket.emit('pong');
    })

    socket.on('message',(msg)=>{
        console.log(msg);
        socket.broadcast.emit('message-broadcast',msg)
    })

   // socket.to('game').emit('nice game', "let's play a game");

}

mongoose.connect(
    process.env.LOCAL_DB,{
        useNewUrlParser:true,
        useUnifiedTopology:true,
        useFindAndModify:false,
        useCreateIndex: true
    }
).then(
   ()=>{ console.log('connected to mongodb...')}
).catch(
    e=>{console.log(`could not connect due to ${e}`)}
)

const PORT  = process.env.PORT || 3000;



io.on('connection',connectionHandler);
http.listen(PORT,()=>console.log(`listening on port${PORT}...` ));

process.on('unhandledRejection', (error)=>{
    console.log(error.name, error.message) // define here an efficient error notification...
    console.log('unhandled rejection: shutting down...');
    server.close(()=>{
        process.exit(1)
    })
});


