import backgroundConnection from 'can-devtools/ui/background-connection/';
import injectInstrumentation from 'can-devtools/ui/inject/';
import {bind as bindToDataSources, update as updateDataSources} from 'can-devtools/ui/data-sources/';

class Bridge {
  constructor (vm) {
    this._init = 1;

    this.vm = vm;
    bindToDataSources(vm);

    backgroundConnection.onMessage.addListener((msg) => { this.handleMessage(msg); });

  }
  init () {
    if(this._init) {
      chrome.devtools.panels.elements.onSelectionChanged.addListener(this.setSelectedElement.bind(this));
      this._init = 0;
    }

    this.setSelectedElement();
  }
  runInstrumentationCommand (cmd, args) {
    chrome.devtools.inspectedWindow.eval('window.__can_devtools_instrumentation_agent__.' + cmd + '(' + args + ')', function(result, isException) {
      // console.log('UI: runInstrumentationCommand', cmd, args, result, isException);
      //TODO: Handle errors
    });
  }
  setSelectedElement () {
    this.runInstrumentationCommand('setSelectedElement', '$0');
  }
  handleMessage (message) {
    // console.log('-> UI:', message);
    var handler = this.handlers[message.name];
    if (!handler) {
      console.warn('No handler found for event ' + message.name);
      return;
    }

    handler.call(this, message.data);
  };
};

Bridge.prototype.handlers = {
  connected: function() {
    this.init();
  },
  canFound: function () {
    //ignore
  },
  canNotFound: function () {
    this.vm.attr('inactive', true);
  },
  update: function (data) {
    updateDataSources(data);
  },
  reloaded: function () {
    injectInstrumentation();
  },
  disconnect: function () {
  }
  //Other message types
};

export default Bridge;
