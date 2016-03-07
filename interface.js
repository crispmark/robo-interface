import React from 'react';
import ReactDOM from 'react-dom';
import io from 'socket.io-client';
import command from './robo-commands.js'
//establish connection to server
var socket = io.connect();

//button interface for issuing commands to robot
var ButtonInterface = React.createClass({

  getInitialState: function() {
    return {activeCommand: undefined};
  },

  //send message to robot server on button press
  handlePress: function(direction) {
    if (direction === this.lastButton)
    return;

    this.lastButton = direction;

    this.setState({activeCommand: direction});
    socket.emit(command.COMMAND, direction);
  },

  lastButton: undefined,

  //send message to robot server on keypress,  stop listening to any futher
  //key presses until key is released
  handleKeyDown: function(e) {

    var code = e.code;

    var direction = getDirectionFromKey(code);

    if(!direction)
    return;

    if (direction === this.lastButton)
    return;

    this.lastButton = direction;

    this.setState({activeCommand: direction});
    socket.emit(command.COMMAND, direction);

  },
  //send message to robot server on button release
  handleRelease: function(direction) {
    if (direction !== this.lastButton)
    return;

    this.lastButton = undefined;
    this.setState({activeCommand: undefined});
    socket.emit(command.COMMAND, command.STOP);
  },

  //send message to robot server on key release, start listening to key presses
  //again
  handleKeyUp: function(e) {
    var code = e.code;

    var direction = getDirectionFromKey(code);
    if (!direction)
    return;

    this.lastButton = undefined;
    this.setState({activeCommand: undefined});
    socket.emit(command.COMMAND, command.STOP);
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
    var activeCommand = this.state.activeCommand;
    var topButton = createTopButton.call(this, activeCommand);
    var bottomButton = createBottomButton.call(this, activeCommand);
    var leftButton = createLeftButton.call(this, activeCommand);
    var rightButton = createRightButton.call(this, activeCommand);
    return (
      <div className="allButtons">
        <div className="topButton">
          {topButton}
        </div>
        <div className="sideButtons">
          {leftButton}
          {rightButton}
        </div>
        <div className="bottomButton">
          {bottomButton}
        </div>
      </div>
    );
  }
});

function createTopButton(activeCommand) {
  return createButton.call(this, activeCommand, command.FORWARD);
}

function createBottomButton(activeCommand) {
  return createButton.call(this, activeCommand, command.REVERSE);
}

function createLeftButton(activeCommand) {
  return createButton.call(this, activeCommand, command.TURN_LEFT);
}

function createRightButton(activeCommand) {
  return createButton.call(this, activeCommand, command.TURN_RIGHT);
}

function createButton(activeCommand, direction) {
  if (activeCommand === direction) {
    return(<button className="activeButton" onTouchEnd={this.handleRelease.bind(this, direction)} onTouchStart={this.handlePress.bind(this, direction)} onMouseUp={this.handleRelease.bind(this, direction)} onMouseDown={this.handlePress.bind(this, direction)}>BUTTON</button>);
  }
  else {
    return (<button onTouchEnd={this.handleRelease.bind(this, direction)} onTouchStart={this.handlePress.bind(this, direction)} onMouseUp={this.handleRelease.bind(this, direction)} onMouseDown={this.handlePress.bind(this, direction)}>BUTTON</button>);
  }
}

function getDirectionFromKey(key) {
  switch(key) {
    case 'KeyW':
    case 'ArrowUp':
    return command.FORWARD;
    break;
    case 'KeyS':
    case 'ArrowDown':
    return command.REVERSE;
    break;
    case 'KeyA':
    case 'ArrowLeft':
    return command.TURN_LEFT;
    break;
    case 'KeyD':
    case 'ArrowRight':
    return command.TURN_RIGHT;
    break;
  }
}

// adds buttons to DOM
ReactDOM.render(<ButtonInterface />, document.getElementById('container'));
