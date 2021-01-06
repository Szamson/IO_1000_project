const { server } = require('karma');

const io = require('socket.io')();

class User
{
    id;
    code;
    name;
};

class FormData
{
    username;
    serverCode;
};

class Server
{
    code;
    host;
    player1;
    player2;
    player3;
};

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }

io.sockets.on('connect', (client) => { 
    count = 0;
    let user = new User();
    let server = new Server();
    console.log("AAAAAAA");

    client.on('createServer', handleCreateServer)
    client.on('createUser', handleCreateUser)
    client.on('joinServer', handleJoinServer)

    client.on('disconnect', _ => {console.log("BBBBBBBBB")});


    function handleCreateServer(username)
    {
        console.log("Created server by user " + username);
        server.code = makeid(5);
        server.host = username;
        client.emit('serverCreated', server);
    }

    function handleCreateUser(username)
    {
        user.name = username;
        user.id = makeid(5);
        user.code = makeid(5);
        client.emit('userCreated', user);
    }

    function handleJoinServer(formData)
    {

    }

});



io.listen(8000);