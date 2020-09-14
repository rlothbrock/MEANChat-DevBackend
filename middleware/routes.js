const users = require('../users/route');
const auth = require('../auth/route');
const rooms = require('../rooms/route');
const messages = require('../messages/route');



module.exports = function(application){
    application.use('/api/v1/users',users);
    application.use('/api/v1/portal', auth);
    application.use('/api/v1/rooms', rooms);
    application.use('/api/v1/messages', messages);
}
