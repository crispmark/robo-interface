var five = require("johnny-five");
var command = require('./robo-commands.js')

var Raspi = require("raspi-io");
var board = new five.Board({
  io: new Raspi()
});

board.on("ready", function() {
  var led = new five.Led("P1-13");
  led.blink();
});

var io = require('socket.io-client')('http://localhost:3000', {query: 'type=robot'});

//establish connection to server
var socket = io.connect();

//listen for commands to robot
socket.on(command.COMMAND, function(msg) {
  console.log(msg);
});
