const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    username:{
        type: String,
        required: [true, 'username is required'],
        maxlength: [20,' please username must be lower than 20 chars'],
        trim: true
    },
    email:{
        type: String,
        required: [true,'email is required'],
        validate:{
            validator: (value)=>{ // RegExp must be enhanced
                return /^[A-z]\w{3,25}\.{0,1}\w{0,25}@\w{3,10}.[a-z]{2,6}(.[a-z]{2,3})?$/.test(value)
            }, 
            message: 'please provide a valid email'
        },
    },
    password:{
        type: String,
        required: [true, 'please provide a password'],
        minlength:[8,'please use 8 chars at least for password']
    }
});

module.exports.User = mongoose.model('User',schema);