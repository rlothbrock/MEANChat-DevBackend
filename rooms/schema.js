const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    members: [mongoose.Schema.Types.ObjectId],
    createdAt: {
        type: Date,
        default: Date.now
    }
    
});

module.exports.Room = mongoose.model('Room',schema);
