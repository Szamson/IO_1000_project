const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http, {cors: {origin: 'http://localhost:4200'}});

messeges  = {};

http.listen(3000);
console.log("wat");

io.on("connection", socket => {
    let previousId;
    console.log("Joined");
    const safeJoin = currentId => {
      socket.leave(previousId);
      socket.join(currentId);
      previousId = currentId;
    };

    socket.on("getMsg", id =>{
      safeJoin(id);
      socket.emit(messeges[id]);
    });
  
    socket.on("sendMsg", messege =>{
      messeges[length(messeges)] = messege;
    })

    /*socket.on("getDoc", docId => {
      safeJoin(docId);
      socket.emit("document", documents[docId]);
    });
  
    socket.on("addDoc", doc => {
      documents[doc.id] = doc;
      safeJoin(doc.id);
      io.emit("documents", Object.keys(documents));
      socket.emit("document", doc);
    });
  
    socket.on("editDoc", doc => {
      documents[doc.id] = doc;
      socket.to(doc.id).emit("document", doc);
    });*/
  
    io.emit("messeges", Object.keys(documents));
  });