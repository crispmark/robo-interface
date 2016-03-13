// initialize express app and middleware
const express = require('express');
const app = express();

app.use(express.static(__dirname + '/public'));
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

// initialize http server using express app, start listening on port
const http = require('http').Server(app);
const port = 3000;
http.listen(port, function(){
  console.log('listening on *:', port);
});

// initialize socket and start listening for messages
const io = require('socket.io')(http);



// initialize RasPi board and grab the module exports (board, runCommand)
const robo = require('./roboJohnny');
const command = require('./robo-commands');

robo.board.on('ready', function() {
  // board is ready, start listening for socket messages
  io.on('connection', function(socket) {
    console.log('a user connected (id:', socket.id, ')');

    //listen for commands to robot
    socket.on(command.COMMAND, function(msg) {
      robo.runCommand(msg); // msg contains the specific command to run
    });

    socket.on('disconnect', function(){
      console.log('a user disconnected (id:', socket.id, ')');
    });
  });

  // cleanup on exit
  this.on("exit", function() {
    robo.runCommand(command.STOP);
  });
})



// var robosocket;
//
// io.on('connection', function(socket){
//   console.log('a user connected');
//
//   //listen for commands to robot
//   socket.on(command.COMMAND, function(msg) {
//     if(robosocket)
//     robosocket.emit(command.COMMAND, msg)
//   });
//
//   socket.on('disconnect', function(){
//     console.log('user disconnected');
//   });
// });
//
// io.use(function(socket, next){
//   var type = socket.handshake.query.type;
//
//   //set robosocket to socket
//   if (type === 'robot')
//   robosocket = socket;
//
//   // return the result of next() to accept the connection.
//   return next();
// });
