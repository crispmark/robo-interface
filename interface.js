import React from 'react';
import ReactDOM from 'react-dom';
import io from 'socket.io-client';
import command from './robo-commands.js'
//establish connection to server
var socket = io.connect();

//button interface for issuing commands to robot
var ButtonInterface = React.createClass({

  //send message to robot server on button press
  handlePress: function(direction) {
    switch (direction) {
      case 'up':
      socket.emit(command.COMMAND, command.FORWARD);
      break;
      case 'down':
      socket.emit(command.COMMAND, command.REVERSE);
      break;
      case 'left':
      socket.emit(command.COMMAND, command.TURN_LEFT);
      break;
      case 'right':
      socket.emit(command.COMMAND, command.TURN_RIGHT);
      break;
    }
  },

  lastEvent: undefined,

  //send message to robot server on keypress,  stop listening to any futher
  //key presses until key is released
  handleKeyDown: function(e) {

    var code = e.code;

    //dont resend message if event is the same
    if (code === this.lastEvent)
    return;

    switch(code) {
      case 'KeyW':
      case 'ArrowUp':
      this.lastEvent = code;
      socket.emit(command.COMMAND, command.FORWARD);
      break;
      case 'KeyS':
      case 'ArrowDown':
      this.lastEvent = code;
      socket.emit(command.COMMAND, command.REVERSE);
      break;
      case 'KeyA':
      case 'ArrowLeft':
      this.lastEvent = code;
      socket.emit(command.COMMAND, command.TURN_LEFT);
      break;
      case 'KeyD':
      case 'ArrowRight':
      this.lastEvent = code;
      socket.emit(command.COMMAND, command.TURN_RIGHT);
      break;
    }
  },
  //send message to robot server on button release
  handleRelease: function() {
    socket.emit(command.COMMAND, command.STOP);
  },

  //send message to robot server on key release, start listening to key presses
  //again
  handleKeyUp: function(e) {
    var code = e.code;

    if(code !== this.lastEvent)
    return;

    switch(code) {
      case 'KeyW':
      case 'KeyS':
      case 'KeyA':
      case 'KeyD':
      case 'ArrowUp':
      case 'ArrowDown':
      case 'ArrowLeft':
      case 'ArrowRight':
      this.lastEvent = undefined;
      socket.emit(command.COMMAND, command.STOP);
      break;
    }
  },

  //add key listeners on mount
  componentWillMount:function(){
    document.addEventListener("keydown", this.handleKeyDown, false);
    document.addEventListener("keyup", this.handleKeyUp, false);
  },

  //remove key listeners on unmount
  componentWillUnmount: function() {
    document.removeEventListener("keydown", this.handleKeyDown, false);
    document.removeEventListener("keyup", this.handleKeyUp, false);
  },

  render: function() {
    return (
      <div className="allButtons" onKeyDown={this.handleKeyPress}>
        <div className="topButton">
          <button onMouseUp={this.handleRelease} onMouseDown={this.handlePress.bind(this, 'up')}>up</button>
        </div>
        <div className="sideButtons">
          <button onMouseUp={this.handleRelease} onMouseDown={this.handlePress.bind(this, 'left')}>left</button>
          <button onMouseUp={this.handleRelease} onMouseDown={this.handlePress.bind(this, 'right')}>right</button>
        </div>
        <div className="bottomButton">
          <button onMouseUp={this.handleRelease} onMouseDown={this.handlePress.bind(this, 'down')}>down</button>
        </div>
      </div>
    );
  }
});


// adds buttons to DOM
ReactDOM.render(<ButtonInterface />, document.getElementById('container'));
