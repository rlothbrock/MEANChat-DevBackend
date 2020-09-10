this server implements real time communication using socket.io


-----------
dev notes:

esquema de las rooms:
miembros: [ObjectId] // child reference

esquema de los mensajes:
room: [ObjectId] // parent reference
text:  String
date: Date def. D.now
