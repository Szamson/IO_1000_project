var http = require('http');
var server = http.createServer().listen(3000);
var io = require('socket.io').listen(server);
var querystring = require('querystring');

function remove_room(room_data) {
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

  var self_name = '';
  var self_code = '';
  console.log("Connected to client");

  socket.on('createUser',handleCreateUser);
  socket.on('createServer',handleCreateServer);
  socket.on('joinServer',handleJoinServer);


  function handleCreateUser(username) {
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
            socket.in(self_code).emit('joinedServer',JSON.parse(data));
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
      }

      res.on('end',()=>{
        console.log('No more data in response.');
      })
    });
    request.write(values);
    request.end();
  }


  socket.on('disconnect',()=>{

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
      switch (res.statusCode) {
        case 200:
          res.on('data',(data)=>{
            socket.in(self_code).emit('playerDisconnected',JSON.parse(data));
            remove_room(JSON.parse(data));
            console.log(`${self_name} disconnected from room ${self_code}`);
            remove_player(self_name);
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
  });
});



let gameServers = {};
let gameStates = {};
let clientRooms = {};
let users = {};

io.sockets.on('connect', (client) => {

    client.on('startGame', handleStartGame);
    //client.on('disconnect', handleDisconnect);

    function handleStartGame(serverCode)
    {
        room = io.sockets.adapter.rooms[serverCode];
        count = Object.keys(room.sockets).length;
        if(count > 2)
        {
            state = createNewGameState(room);
            gameStates[serverCode] = state;
            io.in(serverCode).emit('gameStarted', state);
            console.log(state);
            console.log(serverCode);
        }
        else
        {
            console.log("Not enough players");
            client.emit('notEnoughPlayers');
        }
    }

    function handleDisconnect()
{
    if(users[client.id])
    {
        if(clientRooms[client.id])
        {
            room = clientRooms[client.id];
            if(gameStates[room])
            {
                //Emit winning or something idc.
            }
            player = users[client.id].name;
            gameRoom = gameServers[room];
            gameRoom = removeFromServer(gameRoom, player)

            gameServers[room] = gameRoom;

            client.to(room).emit('playerDisconnected', gameRoom);
        }

    }
    console.log("Player disconnected");
}

});

function createNewGameState(room)
{
    sockets = room.sockets;
    let names = []
    for(let socket of Object.keys(sockets))
    {
        names.push(users[socket].name);
    }
    let hands = {}

    names.forEach(username =>
    {
        hands[username] = [
            {figure : 9, color : 1},
            {figure : 10, color : 1},
            {figure : 11, color : 1},
            {figure : 12, color : 1},
            {figure : 13, color : 1},
            {figure : 14, color : 1},
        ]
    });

    return {
        table: [],
        hands : hands
    }
}

function removeFromServer(gameRoom, player)
{
    if(player == gameRoom.host)
    {
        gameRoom.host = gameRoom.player1;
        gameRoom.player1 = gameRoom.player2;
        gameRoom.player2 = gameRoom.player3;
        gameRoom.player3 = null;
    }
    else if(player == gameRoom.player1)
    {
        gameRoom.player1 = gameRoom.player2;
        gameRoom.player2 = gameRoom.player3;
        gameRoom.player3 = null;
    }
    else if(player == gameRoom.player2)
    {
        gameRoom.player2 = gameRoom.player3;
        gameRoom.player3 = null;
    }
    else if(player == gameRoom.player3)
    {
        gameRoom.player3 = null;
    }
    return gameRoom;
}
