import sendMessage from 'can-devtools/instrumentation/send-message/';
import vmBehavior from 'can-devtools/instrumentation/agent/behaviors/viewmodel';

class Agent {
  constructor (can) {
    this.can = can;

    this.selectedElement = null;
    this.behaviors = [];

    this.initBehaviors();
    this.listen();
  }

  //Start listening for events from content-script
  listen () {
    window.addEventListener('message', function(event) {
      var message = event.data;
      // console.log('-> Instrumentation', message);

      if (!this.isValidMessage(event)) {
        return;
      }

      this.handleMessage(message);
    }.bind(this));
  }

  isValidMessage (event) {
    return event.source !== window ||
          typeof message !== 'object' ||
          message === null ||
          message.source !== 'can-devtools-content-script';
  }

  handleMessage (message) {
    var handler = this.handlers[message.name];
    if (!handler) {
      //TODO: Warning for no handler found
      console.warn('No handler found for event ' + message.name);
      return;
    }

    handler.call(this, message.data);
  }

  initBehaviors () {
    this.behaviors.push(new vmBehavior(this.can, this.sendUpdate.bind(this)));
  }

  updateBehaviorsElement (el) {
    this.behaviors.forEach(function(b) {
      b.setElement(el);
    });
  }

  updateBehaviors (data) {
    this.behaviors.forEach(function(b) {
      if(data[b.name]) {
        b.update(data[b.name]);
      }
    });
  }

  getMessageFromBehaviors () {
    var message = {};
    this.behaviors.forEach(function(b) {
      message[b.name] = b.do();
    });
    return message;
  }

  sendUpdate () {
    var message = this.getMessageFromBehaviors();
    sendMessage('update', message);
  }

  setSelectedElement (el) {
    this.selectedElement = el;
    this.updateBehaviorsElement(el);
    this.sendUpdate();
  }

};

Agent.prototype.handlers = {
  connect: function () {
    sendMessage('connected');
  },
  update: function (data) {
    this.updateBehaviors(data);
  },
};

export default Agent;
