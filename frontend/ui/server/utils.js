module.exports = {
    makeid, createRoom, appendPlayer
}

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }

function createRoom(host)
{
    return {
        code : makeid(5),
        host : host,
        player1 : null,
        player2 : null,
        player3 : null
    };
}

function appendPlayer(username, server)
{
    if(server.player1 == null)
    {
        server.player1 = username;
    }
    else if(server.player2 == null)
    {
        server.player2 = username;
    }
    else if(server.player3 == null)
    {
        server.player3 = username;
    }
    return server;
}