var http = require('http');
var server = http.createServer().listen(3000);
var io = require('socket.io').listen(server);
var querystring = require('querystring');
const { isNumeric } = require('tslint');

function remove_room(room_data) {
  /**
  * Function that deletes room after its empty
  * @param {String} room_data Code to room which is being deleted
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
  /**
  * Function that deletes player after he disconnects
  * @name {String} name of the player to delete
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

function deal_cards() {

  /**
   * Function sorts deck and deals cards to players
   * @return {Object} Returns arrays of player cards and mus
   * */

  var player1 = [];
  var player2 = [];
  var player3 = [];
  var mus = [];

  var deck = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23];

  deck = deck.sort(() => Math.random() - 0.5);
  mus.push(deck.shift(),deck.shift(),deck.shift());
  player1.push(deck.shift(),deck.shift(),deck.shift(),deck.shift(),deck.shift(),deck.shift(),deck.shift());
  player2.push(deck.pop(),deck.pop(),deck.pop(),deck.pop(),deck.pop(),deck.pop(),deck.pop());
  player3.push(deck.shift(),deck.shift(),deck.shift(),deck.shift(),deck.shift(),deck.shift(),deck.shift());

  return {
    "player1": player1,
    "player2": player2,
    "player3": player3,
    "mus": mus,
  }
}

io.on('connection', (socket) => {

  /**
  * Socket which communicates with client
  * @connection event on player connection
  * @socket function that emits sockets comms
  */

  var self_name = '';
  var self_code = '';
  console.log("Connected to client");
  socket.on('createUser',handleCreateUser);
  socket.on('createServer',handleCreateServer);
  socket.on('joinServer',handleJoinServer);
  socket.on('startGame', handleStartGame);
  socket.on('submitLicitation', handleStartLicitation);
  socket.on('wonLicitation',handleWonLicitation);
  socket.on('submitMusik', handleSubmitMusik);
  socket.on('playedCard',handlePlayedCard);
  socket.on('wonRozegranie',handlewonRozegranie);


  function handleCreateUser(username) {
    /**
    * Handles user creation, sends requests to server that handles database
    * @username {String} Name of player that is currently being created
    */
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
    /**
    * Handles room creation, sends requests to server that handles database
    * @username {String} name of player who is host of the room
    */
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
    /**
    * Handles player joining room
    * @data {JSON} name of player that is joining, and code of room to witch he wishes to join
    */
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
    /**
    * Handles game start(checks if number of player is good etc.)
    * @code {String} code of the room in which game should start
    */

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
              var cards = deal_cards();
              var value_game = querystring.stringify({
                "code":JSON.parse(data).code,
                "mus":cards.mus.toString(),
                "player_1_hand":cards.player1.toString(),
                "player_2_hand":cards.player2.toString(),
                "player_3_hand":cards.player3.toString(),
                "player_1_points":0,
                "player_2_points":0,
                "player_3_points":0,
                "player_4_points":0,
                "middle":"",
                "inactive_player":JSON.parse(data).player_3,
                "current_player":JSON.parse(data).host
              });
              var options = {
                hostname:'localhost',
                port:'8000',
                path:'/api/game-create',
                method:'POST',
                headers:{
                  'Content-Type':'application/x-www-form-urlencoded',
                  'Content-Length':value_game.length
                }
              };
              var request = http.request(options,(res)=>{
                res.setEncoding('utf8');
                switch (res.statusCode) {
                  case 201:
                    res.on('data',(data)=>{
                      console.log(data);
                      var current_data = JSON.parse(data);
                      current_data.player_1_hand = JSON.parse("["+current_data.player_1_hand+"]");
                      current_data.player_2_hand = JSON.parse("["+current_data.player_2_hand+"]");
                      current_data.player_3_hand = JSON.parse("["+current_data.player_3_hand+"]");
                      current_data.mus = JSON.parse("["+current_data.mus+"]");
                      current_data.middle = JSON.parse("["+current_data.middle+"]");
                      socket.to(self_code).emit('gameStarted',current_data);
                      socket.emit('gameStarted',current_data);
                      socket.emit('startLicitation');
                    });
                    break;
                  case 400:
                    console.log(`STATUS: ${res.statusCode}`);
                    console.log(`MESSAGE: ${res.statusMessage}`);
                    break;
                }
              });
              request.write(value_game);
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

  function handleStartLicitation(number){
    /**
    * Handles licitation
    * @number {Number} bid of licitation
    */
    io.in(self_code).emit('enableLicitation',number)
  }

  function handleWonLicitation(){
    /**
    * Starts a round after licitation
    */
    var values = querystring.stringify({
      "code":self_code
    });

    var options_room = {
      hostname:'localhost',
      port:'8000',
      path:'/api/room-get',
      method:'POST',
      headers:{
        'Content-Type':'application/x-www-form-urlencoded',
        'Content-Length':values.length
      }

    };
    var request = http.request(options_room, (res) => {
      res.setEncoding('utf8');
      if (res.statusCode === 200){
        res.on('data', (chunk) => {
          var current_lobby = JSON.parse(chunk);

          var values_game = querystring.stringify({
            "code":self_code
          });

          var options = {
            hostname:'localhost',
            port:'8000',
            path:'/api/game-get',
            method:'POST',
            headers:{
              'Content-Type':'application/x-www-form-urlencoded',
              'Content-Length':values_game.length
            }

          };
          var req = http.request(options, (res) => {
            res.setEncoding('utf8');
            if (res.statusCode === 200){
              res.on('data', (chunk) => {
                var current_game = JSON.parse(chunk);

                current_game.mus = JSON.parse("["+current_game.mus+"]");
                socket.to(self_code).emit('showMusik',current_game.mus);
                current_game.current_player = self_name;

                if(current_lobby.host === self_name){
                  current_game.player_1_hand = JSON.parse("["+current_game.player_1_hand+"]");
                  current_game.player_1_hand.push(current_game.mus.pop(),current_game.mus.pop(),current_game.mus.pop());
                  socket.emit('showMusik',current_game.player_1_hand)
                }else{if (current_lobby.player1 === self_name){
                  current_game.player_2_hand = JSON.parse("["+current_game.player_2_hand+"]");
                  current_game.player_2_hand.push(current_game.mus.pop(),current_game.mus.pop(),current_game.mus.pop());
                  socket.emit('showMusik',current_game.player_2_hand)
                }else{
                  current_game.player_3_hand = JSON.parse("["+current_game.player_3_hand+"]");
                  current_game.player_3_hand.push(current_game.mus.pop(),current_game.mus.pop(),current_game.mus.pop());
                  socket.emit('showMusik',current_game.player_3_hand)
                }}

                if (current_game.middle === null){
                  current_game.middle = ""
                }else{
                  current_game.middle = current_game.middle.toString()
                }

                var game_values = querystring.stringify({
                  "code":current_game.code,
                  "mus":"",
                  "player_1_hand":current_game.player_1_hand.toString(),
                  "player_2_hand":current_game.player_2_hand.toString(),
                  "player_3_hand":current_game.player_3_hand.toString(),
                  "player_1_points":current_game.player_1_points,
                  "player_2_points":current_game.player_2_points,
                  "player_3_points":current_game.player_3_points,
                  "player_4_points":current_game.player_4_points,
                  "middle":current_game.middle,
                  "inactive_player":current_game.inactive_player,
                  "current_player":current_game.current_player
                });

                var options_game = {
                  hostname:'localhost',
                  port:'8000',
                  path:'/api/game-update',
                  method:'POST',
                  headers:{
                    'Content-Type':'application/x-www-form-urlencoded',
                    'Content-Length':game_values.length
                  }
                };
                var update = http.request(options_game,(res)=>{
                  res.setEncoding('utf8');
                  if (res.statusCode === 200){
                    console.log(`room ${self_code} updated`)
                  }else{
                    console.log(`STATUS: ${res.statusCode}`);
                    console.log(`MESSAGE: ${res.statusMessage}`);
                    socket.emit('invalidRoomCode');
                  }
                });

                update.write(game_values);
                update.end();

              });
            }else{
              console.log(`STATUS: ${res.statusCode}`);
              console.log(`MESSAGE: ${res.statusMessage}`);
              socket.emit('invalidRoomCode');
            }
          });
          req.write(values_game);
          req.end();

        });
      }else{
        console.log(`STATUS: ${res.statusCode}`);
        console.log(`MESSAGE: ${res.statusMessage}`);
        socket.emit('invalidRoomCode');
      }
    });

    request.write(values);
    request.end();
  }

  function handleSubmitMusik(data){
    /**
    * Allows to give other players cards at the start of the game
    */
    let cards = data;

    var values = querystring.stringify({
      "code":self_code
    });

    var options = {
      hostname:'localhost',
      port:'8000',
      path:'/api/game-get',
      method:'POST',
      headers:{
        'Content-Type':'application/x-www-form-urlencoded',
        'Content-Length':values.length
      }

    };
    var req = http.request(options, (res) => {
      res.setEncoding('utf8');
      if (res.statusCode === 200){
        res.on('data', (chunk) => {
          var current_game = JSON.parse(chunk);

          console.log(current_game);

          current_game.player_1_hand = JSON.parse("["+current_game.player_1_hand+"]");
          current_game.player_2_hand = JSON.parse("["+current_game.player_2_hand+"]");
          current_game.player_3_hand = JSON.parse("["+current_game.player_3_hand+"]");

          if (current_game.player_1_hand.length===10){
            let index = current_game.player_1_hand.indexOf(cards[0]);
            current_game.player_1_hand.splice(index,1);
            let index2 = current_game.player_1_hand.indexOf(cards[1]);
            current_game.player_1_hand.splice(index2,1);}
          if (current_game.player_2_hand.length===10){
            let index = current_game.player_2_hand.indexOf(cards[0]);
            current_game.player_2_hand.splice(index,1);
            let index2 = current_game.player_2_hand.indexOf(cards[1]);
            current_game.player_2_hand.splice(index2,1);}
          if (current_game.player_3_hand.length===10){
            let index = current_game.player_3_hand.indexOf(cards[0]);
            current_game.player_3_hand.splice(index,1);
            let index2 = current_game.player_3_hand.indexOf(cards[1]);
            current_game.player_3_hand.splice(index2,1);}

          if (current_game.player_1_hand.length===7){
            current_game.player_1_hand.push(cards.pop())}
          if (current_game.player_2_hand.length===7){
            current_game.player_2_hand.push(cards.pop())}
          if (current_game.player_3_hand.length===7){
            current_game.player_3_hand.push(cards.pop())}

          io.in(self_code).emit('acceptMusik', current_game);

          if (current_game.middle === null){
            current_game.middle = ""
          }else{
            current_game.middle = current_game.middle.toString()
          }

          var game_values = querystring.stringify({
            "code":current_game.code,
            "mus":"",
            "player_1_hand":current_game.player_1_hand.toString(),
            "player_2_hand":current_game.player_2_hand.toString(),
            "player_3_hand":current_game.player_3_hand.toString(),
            "player_1_points":current_game.player_1_points,
            "player_2_points":current_game.player_2_points,
            "player_3_points":current_game.player_3_points,
            "player_4_points":current_game.player_4_points,
            "middle":current_game.middle,
            "inactive_player":current_game.inactive_player,
            "current_player":current_game.current_player
          });

          var options_game = {
            hostname:'localhost',
            port:'8000',
            path:'/api/game-update',
            method:'POST',
            headers:{
              'Content-Type':'application/x-www-form-urlencoded',
              'Content-Length':game_values.length
            }
          };
          var update = http.request(options_game,(res)=>{
            res.setEncoding('utf8');
            if (res.statusCode === 200){
              console.log(`room ${self_code} updated`)
            }else{
              console.log(`STATUS: ${res.statusCode}`);
              console.log(`MESSAGE: ${res.statusMessage}`);
              socket.emit('invalidRoomCode');
            }
          });

          update.write(game_values);
          update.end();
        });
      }else{
        console.log(`STATUS: ${res.statusCode}`);
        console.log(`MESSAGE: ${res.statusMessage}`);
        socket.emit('invalidRoomCode');
      }
    });
    req.write(values);
    req.end();
  }

  function handlePlayedCard(data){
    /**
    * Updates Game state after played card
    * @data {String} game code
    */
    var values = querystring.stringify({
      "code":self_code
    });

    var options_room = {
      hostname:'localhost',
      port:'8000',
      path:'/api/room-get',
      method:'POST',
      headers:{
        'Content-Type':'application/x-www-form-urlencoded',
        'Content-Length':values.length
      }

    };
    var request = http.request(options_room, (res) => {
      res.setEncoding('utf8');
      if (res.statusCode !== 200) {
        console.log(`STATUS: ${res.statusCode}`);
        console.log(`MESSAGE: ${res.statusMessage}`);
        socket.emit('invalidRoomCode');
      } else {
        res.on('data', (chunk) => {
          var current_lobby = JSON.parse(chunk);

          var values_game = querystring.stringify({
            "code": self_code
          });

          var options = {
            hostname: 'localhost',
            port: '8000',
            path: '/api/game-get',
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Content-Length': values_game.length
            }

          };
          var req = http.request(options, (res) => {
            res.setEncoding('utf8');
            if (res.statusCode === 200) {
              res.on('data', (chunk) => {
                var current_game = JSON.parse(chunk);

                if (current_game.player_1_hand === null) {
                  current_game.player_1_hand = "";
                }
                if (current_game.player_2_hand === null) {
                  current_game.player_2_hand = "";
                }
                if (current_game.player_3_hand === null) {
                  current_game.player_3_hand = "";
                }

                if (current_lobby.host === self_name) {
                  current_game.player_1_hand = JSON.parse("[" + current_game.player_1_hand + "]");
                  current_game.player_2_hand = JSON.parse("[" + current_game.player_2_hand + "]");
                  current_game.player_3_hand = JSON.parse("[" + current_game.player_3_hand + "]");
                  let index = current_game.player_1_hand.indexOf(data.card);
                  current_game.player_1_hand.splice(index, 1);
                } else {
                  if (current_lobby.player_1 === self_name) {
                    current_game.player_1_hand = JSON.parse("[" + current_game.player_1_hand + "]");
                    current_game.player_2_hand = JSON.parse("[" + current_game.player_2_hand + "]");
                    current_game.player_3_hand = JSON.parse("[" + current_game.player_3_hand + "]");
                    let index = current_game.player_2_hand.indexOf(data.card);
                    current_game.player_2_hand.splice(index, 1);
                  } else {
                    current_game.player_1_hand = JSON.parse("[" + current_game.player_1_hand + "]");
                    current_game.player_2_hand = JSON.parse("[" + current_game.player_2_hand + "]");
                    current_game.player_3_hand = JSON.parse("[" + current_game.player_3_hand + "]");
                    let index = current_game.player_3_hand.indexOf(data.card);
                    current_game.player_3_hand.splice(index, 1);
                  }
                }

                if (current_game.middle == null) {
                  current_game.middle = [data.card];
                } else {
                  current_game.middle = JSON.parse("[" + current_game.middle + "]");
                  current_game.middle.push(data.card);
                }
                current_game.current_player = data.name;
                io.in(self_code).emit('gameUpdate', current_game);

                var game_values = querystring.stringify({
                  "code": current_game.code,
                  "mus": "",
                  "player_1_hand": current_game.player_1_hand.toString(),
                  "player_2_hand": current_game.player_2_hand.toString(),
                  "player_3_hand": current_game.player_3_hand.toString(),
                  "player_1_points": current_game.player_1_points,
                  "player_2_points": current_game.player_2_points,
                  "player_3_points": current_game.player_3_points,
                  "player_4_points": current_game.player_4_points,
                  "middle": current_game.middle.toString(),
                  "inactive_player": current_game.inactive_player,
                  "current_player": current_game.current_player
                });

                var options_game = {
                  hostname: 'localhost',
                  port: '8000',
                  path: '/api/game-update',
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Content-Length': game_values.length
                  }
                };
                var update = http.request(options_game, (res) => {
                  res.setEncoding('utf8');
                  if (res.statusCode === 200) {
                    console.log(`room ${self_code} updated`)
                  } else {
                    console.log(`STATUS: ${res.statusCode}`);
                    console.log(`MESSAGE: ${res.statusMessage}`);
                    socket.emit('invalidRoomCode');
                  }
                });

                update.write(game_values);
                update.end();

              });
            } else {
              console.log(`STATUS: ${res.statusCode}`);
              console.log(`MESSAGE: ${res.statusMessage}`);
              socket.emit('invalidRoomCode');
            }
          });
          req.write(values_game);
          req.end();


        });
      }
    });

    request.write(values);
    request.end();
  }

  function handlewonRozegranie(name){
    /**
    * Handles end of mini round
    * @name {String} name of player who won battle
    */
    var values = querystring.stringify({
      "code":self_code
    });

    var options = {
      hostname:'localhost',
      port:'8000',
      path:'/api/game-get',
      method:'POST',
      headers:{
        'Content-Type':'application/x-www-form-urlencoded',
        'Content-Length':values.length
      }

    };
    var req = http.request(options, (res) => {
      res.setEncoding('utf8');
      if (res.statusCode === 200){
        res.on('data', (chunk) => {
          var current_game = JSON.parse(chunk);

          var game_values = querystring.stringify({
            "code":current_game.code,
            "mus":"",
            "player_1_hand":current_game.player_1_hand.toString(),
            "player_2_hand":current_game.player_2_hand.toString(),
            "player_3_hand":current_game.player_3_hand.toString(),
            "player_1_points":current_game.player_1_points,
            "player_2_points":current_game.player_2_points,
            "player_3_points":current_game.player_3_points,
            "player_4_points":current_game.player_4_points,
            "middle":"",
            "inactive_player":current_game.inactive_player,
            "current_player":name
          });

          var options_game = {
            hostname:'localhost',
            port:'8000',
            path:'/api/game-update',
            method:'POST',
            headers:{
              'Content-Type':'application/x-www-form-urlencoded',
              'Content-Length':game_values.length
            }
          };
          var update = http.request(options_game,(res)=>{
            res.setEncoding('utf8');
            if (res.statusCode === 200){
              console.log(`room ${self_code} updated`)
            }else{
              console.log(`STATUS: ${res.statusCode}`);
              console.log(`MESSAGE: ${res.statusMessage}`);
              socket.emit('invalidRoomCode');
            }
          });

          update.write(game_values);
          update.end();
          current_game.player_1_hand = JSON.parse("[" + current_game.player_1_hand + "]");
          current_game.player_2_hand = JSON.parse("[" + current_game.player_2_hand + "]");
          current_game.player_3_hand = JSON.parse("[" + current_game.player_3_hand + "]");
          io.in(self_code).emit('gameUpdate',current_game);
          if(current_game.player_1_hand.length === 0 && current_game.player_2_hand.length === 0 && current_game.player_3_hand.length === 0){
            io.in(self_code).emit('roundEnd',current_game);
          }
        });

      }else{
        console.log(`STATUS: ${res.statusCode}`);
        console.log(`MESSAGE: ${res.statusMessage}`);
        socket.emit('invalidRoomCode');
      }
    });
    req.write(values);
    req.end();
  }



  socket.on('disconnect',()=>{
    /**
    * Handles client disconnect, sends signals to clear database after him
    * @disconnect event when player disconnects
    */
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
