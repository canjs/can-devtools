var port = chrome.runtime.connect({
	name: 'CanJS'
});

chrome.runtime.sendMessage({
	tabId: chrome.devtools.inspectedWindow.tabId
});

port.onMessage.addListener(function(obj) {
	//Receive message from background and render
	//the message in the panel.html. This is the update
	//point for the CanJS app.
	document.body.innerHTML = JSON.stringify(obj);
});

/*
//If the user has updated the view model from the CanJS app,
//notify the content script with the update() function. It
//takes an object that will be used as viewModel.attr(attrs);

chrome.devtools.inspectedWindow
.eval('!' + updateFn.toString() + '(' + JSON.stringify(attrs) + ')');
 */

//These two functions will be executed in the context of the page.
var inspectFn = function() {
	if($0) inspect($0);
},

updateFn = function(attrs) {
	if($0) update($0, attrs);
};

chrome.devtools
	.panels.elements
	.onSelectionChanged
	.addListener(function() {
		//User has selected a different element. We'll
		//send a message directly to the instrumentation script via
		//the below eval.
		chrome.devtools.inspectedWindow.eval('!' + inspectFn.toString() + '()');
});