var command = require('./robo-commands.js');
var motor = require('./motorControl.js')

var io = require('socket.io-client')('http://localhost:3000', {query: 'type=robot'});

//establish connection to server
var socket = io.connect();

//listen for commands to robot
socket.on(command.COMMAND, function(msg) {
  switch(msg) {
    case command.FORWARD:
    motor.runMotor(1, 64);
    motor.runMotor(2, 64);
    break;
    case command.REVERSE:
    motor.runMotor(1, -64);
    motor.runMotor(2, -64);
    break;
    case command.STOP:
    motor.runMotor(1, 0);
    motor.runMotor(2, 0);
    break;
  }
});
