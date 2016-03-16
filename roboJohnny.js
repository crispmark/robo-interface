const commands = require('./robo-commands.js');
const five = require("johnny-five");
const Raspi = require("raspi-io");
const board = new five.Board({
  io: new Raspi()
});

// pull motor configs from ADAFRUIT_V2 template
const configs = five.Motor.SHIELD_CONFIGS.ADAFRUIT_V2;

// instantiate motors when board is ready
var m1;
var m2;

board.on('ready', function() {
  m1 = new five.Motor(configs.M1);
  m2 = new five.Motor(configs.M2);
});

const SPEED = 128;
const TURN_SPEED = 64;

function runCommand (msg) {
  // don't attempt to move motors which haven't been instantiated yet
  if (!m1 || !m2) {
    console.log('motors not ready, returning...')
    return;
  }

  // the command itself is in the property 'command' of the socket message
  msg = msg.command;

  switch(msg) {
    case commands.FORWARD:
      forward(SPEED);
      break;
    case commands.REVERSE:
      reverse(SPEED);
      break;
    case commands.TURN_LEFT:
      left(TURN_SPEED);
      break;
    case commands.TURN_RIGHT:
      right(TURN_SPEED);
      break;
    case commands.STOP:
      stop();
      break;
  }
}

function forward (speed) {
  m1.fwd(speed);
  m2.fwd(speed);
}

function reverse (speed) {
  m1.rev(speed);
  m2.rev(speed);
}

function left (speed) {
  m1.rev(speed);
  m2.fwd(speed);
}

function right (speed) {
  m1.fwd(speed);
  m2.rev(speed);
}

function stop() {
  m1.stop();
  m2.stop();
}

module.exports = { runCommand: runCommand };
// var STEPS = 10;
// var TIMESTEP = 100;
//
// function forward(finalSpeed) {
//   var speed = 0;
//
//   var interval = setInterval(function() {
//     if (speed > finalSpeed) {
//       clearInterval(interval);
//       return;
//     }
//
//     speed += finalSpeed / STEPS;
//     m1.forward(speed);
//     m2.forward(speed);
//   }, TIMESTEP);
// }
