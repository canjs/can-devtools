var connections = {};

/*
 * instrumentation -> content-script.js -> background.js -> ui
 */
chrome.runtime.onMessage.addListener(function(request, sender) {
  // console.log('-> Background ' + request.name);
  if (sender.tab) {
    var tabId = sender.tab.id;
    if (tabId in connections) {
      // console.log('Background -> UI: ' + request.name + ' (' + tabId + ')');
      connections[tabId].postMessage(request);
    } else {
      // console.log('Background: Tab not found in connection list ' + request.name + ' (' + tabId + ')');
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
      // console.log('-> Background: created connection to: ' + request.tabId);
      connections[request.tabId] = port;

      port.onDisconnect.addListener(function() {
        // console.log('Background: disconnect: ' + request.tabId);
        delete connections[request.tabId];
      });

      return;
    }

    // console.log('Background -> Content Script: ' + request.name + ' (' + request.tabId + ')');

    // Otherwise, broadcast to agent
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
