const { server } = require('karma');

const io = require('socket.io')();

const {createRoom, makeid, appendPlayer} = require('./utils');


let gameStates = {};
let clientRooms = {};

io.sockets.on('connect', (client) => { 
    count = 0;
    console.log("AAAAAAA");

    client.on('createServer', handleCreateServer)
    client.on('createUser', handleCreateUser)
    client.on('joinServer', handleJoinServer)

    client.on('disconnect', _ => {console.log("BBBBBBBBB")});


    function handleCreateServer(username)
    {
        let server = createRoom(username);

        gameStates[server.code] = server;
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
        }
        client.emit('userCreated', user);
    }

    function handleJoinServer(formData)
    {
        console.log(clientRooms);
        formData = JSON.parse(formData);
        const room = io.sockets.adapter.rooms[formData.serverCode];
        console.log(formData);
        let allUsers;
        if(room)
        {
            allUsers = room.sockets;
        }
        let numClients = 0;
        if(allUsers)
        {
            numClients = Object.keys(allUsers).length;
        }
        if(numClients === 0)
        {
            console.log("Unknown code " + formData.serverCode)
            client.emit('unknownServer');
            return;
        }
        else if(numClients > 4)
        {
            console.log("Too many players in a server " + formData.serverCode)
            client.emit('tooManyPlayers');
            return;
        }

        clientRooms[client.id] = formData.serverCode;
        client.join(formData.serverCode);
        gameStates[formData.serverCode] = appendPlayer(formData.username, gameStates[formData.serverCode])

        client.emit('joinedServer', gameStates[formData.serverCode]);
        client.to(formData.serverCode).emit('updatePlayers', gameStates[formData.serverCode]);
        console.log(gameStates);
    }

});



io.listen(8000);