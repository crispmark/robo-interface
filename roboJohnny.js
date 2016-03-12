var five = require("johnny-five");
var Raspi = require("raspi-io");
var board = new five.Board({
  io: new Raspi()
});

var m1 = new five.Motor({
  pins: {
    pwm: 8,
    dir: 9,
    cdir: 10
  }
});

var m2 = new five.Motor({
  pins: {
    pwm: 13,
    dir: 12,
    cdir: 11
  }
});

board.on("ready", function() {
  m1.start(32);

  board.wait(1000, function() {
    m1.stop();
  })
});
