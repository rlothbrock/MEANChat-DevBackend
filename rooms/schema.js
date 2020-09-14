const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    members: {
        type: [mongoose.Schema.Types.ObjectId],
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    roomName:String,
});

module.exports.Room = mongoose.model('Room',schema);
