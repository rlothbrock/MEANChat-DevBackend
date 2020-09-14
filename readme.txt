this server implements real time communication using socket.io


-----------
dev notes:

esquema de las rooms:
miembros: [ObjectId] // child reference
name: ? string
date: Date def. D.now


esquema de los mensajes:
room: [ObjectId] // parent reference
text:  String
date: Date def. D.now

apis:
rooms:
createRoom -> 
    require memebrs on: req.body.members
