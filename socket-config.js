module.exports.socketConfig = (socket)=>{
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