var http = require('http');
var server = http.createServer().listen(8000);
var io = requre('socket.io').listen(server);
var querystring = require('querystring');


io.on('connection',function (socket) {
  console.log("Connected to client");
  socket.on('createUser',function (data) {
    console.log('Web-->Node');
    var values = querystring.stringify(data);
    console.log(values);

    var options = {
      hostname:'localhost',
      port:'8000',
      path:'/player-create',
      method:'POST',
      headers:{
        'Content-Type':'application/x-www-form-urlencoded',
        'Content-Length':values.length
      }
    };
    var request = http.request(options, function(response) {
      response.setEncoding('utf8');
      response.on('data',function(data){
        //Here return django
        console.log('Django-->Node');
        io.emit('createUser',data);
      });
    });

    request.write(values);
    request.end();
  });
});

const {createRoom, makeid, appendPlayer} = require('./utils');


let gameServers = {};
let gameStates = {};
let clientRooms = {};
let users = {};

io.sockets.on('connect', (client) => {
    count = 0;
    console.log("AAAAAAA");

    client.on('createServer', handleCreateServer);
    client.on('createUser', handleCreateUser);
    client.on('joinServer', handleJoinServer);
    client.on('startGame', handleStartGame);
    client.on('disconnect', handleDisconnect);


    function handleCreateServer(username)
    {
        let server = createRoom(username);

        gameServers[server.code] = server;
        console.log("Created server by user " + username);
        clientRooms[client.id] = server.code;

        client.join(server.code);
        client.number = 1;
        client.emit("joinedServer", server);
    }

    function handleCreateUser(username)
    {
        user = {
            id : makeid(5),
            code : makeid(5),
            name : username,
        };
        users[client.id] = user;
        client.emit('userCreated', user);
    }

    function handleJoinServer(formData)
    {
        formData = JSON.parse(formData);
        const room = io.sockets.adapter.rooms[formData.serverCode];
        console.log(formData);
        let allUsers;
        if(room)
        {
            allUsers = room.sockets;
            console.log(room.sockets);
        }
        let numClients = 0;
        if(allUsers)
        {
            numClients = Object.keys(allUsers).length;
        }
        if(numClients === 0)
        {
            console.log("Unknown code " + formData.serverCode);
            client.emit('unknownServer');
            return;
        }
        else if(numClients > 3)
        {
            console.log("Too many players in a server " + formData.serverCode);
            client.emit('tooManyPlayers');
            return;
        }

        clientRooms[client.id] = formData.serverCode;
        client.join(formData.serverCode);
        gameServers[formData.serverCode] = appendPlayer(formData.username, gameServers[formData.serverCode]);

        client.emit('joinedServer', gameServers[formData.serverCode]);
        client.to(formData.serverCode).emit('updatePlayers', gameServers[formData.serverCode]);
        console.log(gameServers);
    }

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
            gameRoom = removeFromServer(gameRoom, player);

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
    let names = [];
    for(let socket of Object.keys(sockets))
    {
        names.push(users[socket].name);
    }
    let hands = {};

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
