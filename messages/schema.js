const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    room: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true,'please define a room for sending messages']
    },
    from: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true,'a message needs a sender']
    },
    to: {
        type: [mongoose.Schema.Types.ObjectId],
        required: [true,'a message needs a destinatary']
    },
    text: {
        type: String,
        required: [true,'a message needs a text'],
        maxlength:[1000,'please split the messsage']
    },
    date: {
        type: Date,
        default: Date.now
    }
    
});



module.exports.Message = mongoose.model('Message',schema);
