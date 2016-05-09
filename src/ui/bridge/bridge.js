import backgroundConnection from 'src/ui/background-connection/';
import injectInstrumentation from 'src/ui/inject/';
import {bind as bindToDataSources, update as updateDataSources} from 'src/ui/data-sources/';

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
      //!steal-remove-start
      console.log('UI: runInstrumentationCommand', cmd, args, result, isException);
      //!steal-remove-end
      //TODO: Handle errors
    });
  }
  setSelectedElement () {
    this.runInstrumentationCommand('setSelectedElement', '$0');
  }
  handleMessage (message) {
    //!steal-remove-start
    console.log('-> UI:', message);
    //!steal-remove-end
    var handler = this.handlers[message.name];
    if (!handler) {
      //!steal-remove-start
      console.warn('No handler found for event ' + message.name);
      //!steal-remove-end
      return;
    }

    handler.call(this, message.data);
  };
};

Bridge.prototype.handlers = {
  connected: function() {
    this.init();
		this.vm.attr('detecting', false);
    this.vm.attr('canFound', true);
  },
  canFound: function () {
		this.vm.attr('detecting', false);
    this.vm.attr('canFound', true);
  },
  canNotFound: function () {
		this.vm.attr('detecting', false);
    this.vm.attr('canFound', false);
  },
  update: function (data) {
    updateDataSources(JSON.parse(data));
  },
  reloaded: function () {
    injectInstrumentation();
  },
  disconnect: function () {
  }
  //Other message types
};

export default Bridge;
