import backgroundConnection from 'can-devtools/ui/background-connection/';

var sendMessage = function(name, data) {
  // console.log('UI -> Background:', name, data || {}, chrome.devtools.inspectedWindow.tabId);
  backgroundConnection.postMessage({
    name: name,
    tabId: chrome.devtools.inspectedWindow.tabId,
    data: data || {}
  });
};

export default sendMessage;