chrome.runtime.onConnect.addListener(function(port) {
	if (port.name !== 'CanJS') return;

	chrome.runtime.onMessage.addListener(function(message) {
		if(message.tabId) {
			//Initial message from dev tools. Kick off process
			//by injecting our content script into the page frame.
			chrome.tabs.executeScript({
				file: 'content.js'
			});
		}
		else {
			//Receiving data from content script and sending to dev tools.
			port.postMessage(message);
		}
	});
});