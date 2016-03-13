var command = require('./robo-commands.js');
var five = require("johnny-five");
var Raspi = require("raspi-io");
var board = new five.Board({
  io: new Raspi()
});
// pull motor configs from ADAFRUIT_V2 template
var configs = five.Motor.SHIELD_CONFIGS.ADAFRUIT_V2;
// instantiate motors
var m1 = new five.Motor(configs.M1);
var m2 = new five.Motor(configs.M2);

var io = require('socket.io-client')('http://localhost:3000', {query: 'type=robot'});
//establish connection to server
var socket = io.connect();

var MAXSPEED = 160;

board.on("ready", function() {
  //listen for commands to robot
  socket.on(command.COMMAND, function(msg) {
    switch(msg) {
      case command.FORWARD:
        forward(MAXSPEED);
        break;
      case command.REVERSE:

        break;
      case command.TURN_LEFT:

        break;
      case command.TURN_RIGHT:

        break;
      case command.STOP:
        stop();
        break;
    }
  });
});

var STEPS = 10;
var TIMESTEP = 100;

function forward(finalSpeed) {
  var speed = 0;

  var interval = setInterval(function() {
    if (speed > finalSpeed) {
      clearInterval(interval);
      return;
    }

    speed += finalSpeed / STEPS;
    m1.forward(speed);
    m2.forward(speed);
  }, TIMESTEP);
}

function stop() {
  m1.stop();
  m2.stop();
}
