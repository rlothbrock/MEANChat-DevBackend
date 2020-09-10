const express = require('express');
const mongoose = require('mongoose');

const users = require('./users/route');
const rooms = require('./rooms/route');
const messages = require('./messages/route');

const app = express();

app.use(express.json());
app.use('/api/v1/users',users);
app.use('/api/v1/rooms',rooms);
app.use('/api/v1/messages',messages);

mongoose.connect('mongodb://127.0.0.1:27017/chatMeanDB',{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useFindAndModify:false,
    useCreateIndex: true
})
.then(()=>console.log('connected successfully to db...'))
.catch(()=>console.log('could not connect to db...'))



app.listen(3000,()=>console.log('listening on port 3000'))