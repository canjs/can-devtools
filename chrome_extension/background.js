var connections = {};

/*
 * instrumentation -> content-script.js -> background.js -> ui
 */
chrome.runtime.onMessage.addListener(function(request, sender) {
  // alert('-> Background ' + request.name);
  if (sender.tab) {
    var tabId = sender.tab.id;
    if (tabId in connections) {
      // alert('Background -> UI ' + request.name);
      // alert('Background -> UI: ' + request.name + ' (' + tabId + ')');
      connections[tabId].postMessage(request);
    } else {
      // alert('Background: Tab not found in connection list ' + request.name + ' (' + tabId + ')');
      // console.log("Tab not found in connection list.");
    }
  } else {
    // console.log("sender.tab not defined.");
  }
  return true;
});


/*
 * instrumentation <- content-script.js <- background.js <- ui
 */
chrome.runtime.onConnect.addListener(function(port) {

  // Listen to messages sent from the DevTools page
  port.onMessage.addListener(function(request) {

    // Register initial connection
    if (request.name === 'init') {
      // alert('-> Background: created connection to: ' + request.tabId);
      connections[request.tabId] = port;

      port.onDisconnect.addListener(function() {
        // alert('Background: disconnect: ' + tabId);
        // console.log('background:', 'disconnecting tab', tabId);
        delete connections[request.tabId];
      });

      return;
    }

    // alert('Background -> Content Script: ' + request.name + ' (' + request.tabId + ')');

    // Otherwise, broadcast to agent
    // alert('Background -> Content Script ' + request.name);

    chrome.tabs.sendMessage(request.tabId, {
      name: request.name,
      data: request.data
    });
  });

});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
  if (tabId in connections && changeInfo.status === 'complete') {
    // TODO: reload connection to page somehow...?
      connections[tabId].postMessage({
      name: 'reloaded'
    });
  }
});