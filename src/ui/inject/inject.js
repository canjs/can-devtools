import sendMessage from 'can-devtools/ui/send-message/';

var inject = function () {
  // console.log('UI:', 'injecting instrumentation');
  var global = 'window.__can_devtools_instrumentation_injected__';

  chrome.devtools.inspectedWindow.eval(global, function(result, isException) {
    //TODO: Handle errors
    if (!result) {
      // script hasn't been injected yet

      var xhr = new XMLHttpRequest();
      xhr.open('GET', chrome.extension.getURL('/dist/instrumentation/instrumentation.js'), false);
      xhr.send();
      var script = xhr.responseText;

      chrome.devtools.inspectedWindow.eval(script, function() {
        sendMessage('connect');
      });

    } else {
      sendMessage('connect');
    }
  });
}

export default inject;
