var http = require('http');
var server = http.createServer().listen(3000);
var io = require('socket.io').listen(server);
var querystring = require('querystring');

function remove_room(room_data) {
  /*
  * Function that deletes room after its empty
  * :param room_data: code to room
  * */

      if(room_data.host === null){
      var value = querystring.stringify({
        "code":room_data.code
      });
      var option ={
        hostname:'localhost',
        port:'8000',
        path:'/api/room-delete',
        method:'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': value.length
        }
      };
      var request1 = http.request(option,()=>{
        switch (request1.statusCode) {
          case 200:
            console.log(`room ${room_data.code} deleted`);
            break;
          case 400:
            console.log('Just not found');
            break;
          case 404:
            console.log('Room not found');
            break;
        }
      });
      request1.write(value);
      request1.end();
      }
    }

function remove_player(name) {
  /*
  * Function that deletes player after he disconnects
  * :param name: name of the player
  * */
      var value = querystring.stringify({
        "name":name
      });
      var option ={
        hostname:'localhost',
        port:'8000',
        path:'/api/player-delete',
        method:'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': value.length
        }
      };
      var request = http.request(option,()=>{
        switch (request.statusCode) {
          case 200:
            console.log(`player ${name} deleted`);
            break;
          case 400:
            console.log('Just not found');
            break;
          case 404:
            console.log('Room not found');
            break;
        }
      });
      request.write(value);
      request.end();
    }

io.on('connection', (socket) => {

  /*
  * Socket which communicates with client
  * :param 'connection': on player connection
  * :param function socket: tool to emit stuff*/

  var self_name = '';
  var self_code = '';
  console.log("Connected to client");

  socket.on('createUser',handleCreateUser);
  socket.on('createServer',handleCreateServer);
  socket.on('joinServer',handleJoinServer);
  socket.on('startGame', handleStartGame);


  function handleCreateUser(username) {
    /*
    * Handles user creation, sends requests to server that handles database
    * :param username: name of player that is currently being created*/
    var values = querystring.stringify({
      'name': username
    });
    console.log(values);
    self_name = username;

    var options = {
      hostname:'localhost',
      port:'8000',
      path:'/api/player-create',
      method:'POST',
      headers:{
        'Content-Type':'application/x-www-form-urlencoded',
        'Content-Length':values.length
      }
    };

    var req = http.request(options, (res) => {
      res.setEncoding('utf8');
      if (res.statusCode === 201){
        res.on('data', (chunk) => {
          socket.emit('userCreated', JSON.parse(chunk));
        });
      }else{
        console.log(`STATUS: ${res.statusCode}`);
        console.log(`MESSAGE: ${res.statusMessage}`);
        socket.emit('usernameTaken');
      }
      res.on('end', () => {
        console.log('No more data in response.');
      });
    });
    req.on('error',(e)=>{
      console.error(`Problem with request: ${e.message}`)
    });
    req.write(values);
    req.end();
  }

  function handleCreateServer(username) {
    /*
    * Handles room creation, sends requests to server that handles database
    * :param username: name of player who is host of the room*/
    var values = querystring.stringify({
        'host': username
    });
    console.log(values);

    var options = {
      hostname:'localhost',
      port:'8000',
      path:'/api/room-create',
      method:'POST',
      headers:{
        'Content-Type':'application/x-www-form-urlencoded',
        'Content-Length':values.length
      }
    };

    var request = http.request(options,(res)=> {
      res.setEncoding('utf8');

      if (res.statusCode === 201){
        res.on('data',(data)=>{
        console.log(data);
        socket.join(JSON.parse(data).code);
        self_code = JSON.parse(data).code;
        socket.emit('joinedServer',JSON.parse(data));
      });
      }else{
        console.log(`STATUS: ${res.statusCode}`);
        console.log(`MESSAGE: ${res.statusMessage}`);
        socket.emit('invalidRoomData');
      }

      res.on('end',()=>{
        console.log('No more data in response.');
      });
    });
    request.write(values);
    request.end();
  }

  function handleJoinServer(data) {
    /*
    * Handles player joining room
    * :param data: name of player that is joining, and code of room to witch he wishes to join*/
    data = JSON.parse(data);
    var values = querystring.stringify({
      "name":data.username,
      "code":data.serverCode
    });

    console.log(values);

    var options = {
      hostname:'localhost',
      port:'8000',
      path:'/api/room-join',
      method:'POST',
      headers:{
        'Content-Type':'application/x-www-form-urlencoded',
        'Content-Length':values.length
      }
    };

    var request = http.request(options,(res)=>{
      res.setEncoding('utf8');

      switch (res.statusCode) {
        case 200:
          res.on('data',(data)=>{
            console.log(data);
            socket.join(JSON.parse(data).code);
            self_code = JSON.parse(data).code;
            socket.to(self_code).emit('joinedServer',JSON.parse(data));
            socket.emit('joinedServer',JSON.parse(data));
          });
          break;
        case 400:
          console.log(`STATUS: ${res.statusCode}`);
          console.log(`MESSAGE: ${res.statusMessage}`);
          socket.emit('invalidRoomData');
          break;
        case 404:
          if (res.statusMessage === 'Bad Request Full'){
            console.log(`STATUS: ${res.statusCode}`);
            console.log(`MESSAGE: ${res.statusMessage}`);
            socket.emit('roomIsFull');
          }else{
            console.log(`STATUS: ${res.statusCode}`);
            console.log(`MESSAGE: ${res.statusMessage}`);
            socket.emit('invalidRoomCode');
          }
          break;
      }

      res.on('end',()=>{
        console.log('No more data in response.');
      })
    });
    request.write(values);
    request.end();
  }

  function handleStartGame(code){
    /*
    * Handles game start(checks if number of player is good etc.)
    * :param code: code of the room in which game should start*/
    var value = querystring.stringify({
      "code":code
    });

    var server_options ={
      hostname:'localhost',
      port:'8000',
      path:'/api/room-get',
      method:'POST',
      headers:{
        'Content-Type':'application/x-www-form-urlencoded',
        'Content-Length':value.length
      }
    };

    var options = {
      hostname:'localhost',
      port:'8000',
      path:'/api/game-create',
      method:'POST',
      headers:{
        'Content-Type':'application/x-www-form-urlencoded',
        'Content-Length':value.length
      }
    };

    var request = http.request(options,(res)=>{
      res.setEncoding('utf8');
      switch (res.statusCode) {
        case 201:
          res.on('data',(data)=>{
            console.log(data);
            socket.to(self_code).emit('gameStarted',JSON.parse(data));
            socket.emit('gameStarted',JSON.parse(data));
          });
          break;
        case 400:
          console.log(`STATUS: ${res.statusCode}`);
          console.log(`MESSAGE: ${res.statusMessage}`);
          break;
      }
    });

    var server_request = http.request(server_options,(res)=>{
      res.setEncoding('utf8');
      switch (res.statusCode) {
        case 200:
          res.on('data',(data)=>{
            console.log(data);
            if(JSON.parse(data).player_1 === null || JSON.parse(data).player_2 === null){
              socket.emit('notEnoughPlayers');
              console.log('Not enough players');
            }else{
              request.write(value);
              request.end();
              console.log(`Game started in room ${code}`);
            }
          });
          break;
        case 400:
          console.log(`STATUS: ${res.statusCode}`);
          console.log(`MESSAGE: ${res.statusMessage}`);
          socket.emit('invalidRoomData');
          break;
        case 404:
          console.log(`STATUS: ${res.statusCode}`);
          console.log(`MESSAGE: ${res.statusMessage}`);
          console.log(code);
          socket.emit('invalidRoomCode');
          break;
      }
    });

    server_request.write(value);
    server_request.end();

  }

  socket.on('disconnect',()=>{
    /*
    * Handles client disconnect, sends signals to clear database after him
    * :param 'disconnect': event */
    var values = querystring.stringify({
      "code":self_code,
      "name":self_name
    });
    var options = {
      hostname:'localhost',
      port:'8000',
      path:'/api/remove-player',
      method:'POST',
      headers:{
        'Content-Type':'application/x-www-form-urlencoded',
        'Content-Length':values.length
      }
    };
    var request = http.request(options, (res)=>{
      res.setEncoding('utf8');
      switch (res.statusCode) {
        case 200:
          res.on('data',(data)=>{
            socket.in(self_code).emit('playerDisconnected',JSON.parse(data));
            remove_room(JSON.parse(data));
            console.log(`${self_name} disconnected from room ${self_code}`);
          });
          break;
        case 400:
          socket.emit('invalidRoomData');
          break;
        case 404:
          if (res.statusMessage === 'Bad Request Not Found'){
            console.log('Player not found')
          }else{
            console.log('invalidRoomCode');
          }
          break;
      }
    });
    request.write(values);
    request.end();
    console.log('Player disconnected');
    remove_player(self_name);
  });
});
