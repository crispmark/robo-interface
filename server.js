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



// instantiate board and import runCommand()
const robo    = require('./roboJohnny');
const command = require('./robo-commands'); // command definitions

io.on('connection', function(socket) {
  console.log('a user connected (id:', socket.id, ')');

  //listen for commands to robot
  socket.on(command.COMMAND, function(msg) {
    console.log('running command:', msg);
    robo.runCommand(msg); // msg contains the specific command to run
  });

  socket.on('disconnect', function(){
    console.log('a user disconnected (id:', socket.id, ')');
    robo.runCommand(command.STOP);
  });
});
