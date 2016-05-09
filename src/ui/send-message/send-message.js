import backgroundConnection from 'can-devtools/ui/background-connection/';

var sendMessage = function(name, data) {
	//!steal-remove-start
  console.log('UI -> Background:', name, data || {}, chrome.devtools.inspectedWindow.tabId);
  //!steal-remove-end
  backgroundConnection.postMessage({
    name: name,
    tabId: chrome.devtools.inspectedWindow.tabId,
    data: data || {}
  });
};

export default sendMessage;