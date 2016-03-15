const PythonShell = require('python-shell');
const command = require('./robo-commands.js');

const SPEED = 64;
const TURN_SPEED = 64;
//the time at which the last command was received
var lastCommand = -Infinity;

// runs commands received as messages (on the socket connection in server.js)
function runCommand (msg) {
  console.log(msg);
  var command = msg.command;
  switch(msg) {
    case command.FORWARD:
    runMotor(1, SPEED);
    runMotor(2, SPEED);
    break;
    case command.REVERSE:
    runMotor(1, -SPEED);
    runMotor(2, -SPEED);
    break;
    case command.TURN_LEFT:
    runMotor(1, TURN_SPEED);
    runMotor(2, -TURN_SPEED);
    break;
    case command.TURN_RIGHT:
    runMotor(1, -TURN_SPEED);
    runMotor(2, TURN_SPEED);
    break;
    case command.STOP:
    runMotor(1, 0);
    runMotor(2, 0);
    break;
  }
}

function runMotor(motor, speed) {
  var pyshell = new PythonShell('./motorControl.py', {
    pythonPath: 'python2',
  });
  // sends a message to the Python script via stdin
  pyshell.send(JSON.stringify({motor: motor, speed: speed}));

  // end the input stream and allow the process to exit
  pyshell.end(function (err) {
    if (err) throw err;
  });
}

module.exports = {
  runCommand: runCommand
}
