var express = require('express');
var app = express();
app.use(express.static(__dirname + '/public'));
var http = require('http').Server(app);
var io = require('socket.io')(http);
var command = require('./robo-commands.js')

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

var robosocket;

io.on('connection', function(socket){
  console.log('a user connected');

  //listen for commands to robot
  socket.on(command.COMMAND, function(msg) {
    if(robosocket)
    robosocket.emit(command.COMMAND, msg)
  });

  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

io.use(function(socket, next){
  var type = socket.handshake.query.type;

  //set robosocket to socket
  if (type === 'robot')
  robosocket = socket;

  // return the result of next() to accept the connection.
  return next();
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
