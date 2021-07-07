const users = require('../../endpoints/users/route');
const auth = require('../../endpoints/auth/route');
const rooms = require('../../endpoints/rooms/route');
const messages = require('../../endpoints/messages/route');



module.exports = function(application){
    application.use('/api/v1/users',users);
    application.use('/api/v1/portal', auth);
    application.use('/api/v1/rooms', rooms);
    application.use('/api/v1/messages', messages);
}
