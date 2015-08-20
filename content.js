//There was an edge case where a script can be clicked and
//not considered part of our shared DOM. TODO: This possibly
//can be removed with a better solution.
var contains = function(parent, child) {
	if(child.parentNode === parent) {
		return true;
	}
	else if(child.parentNode) {
		return contains(parent, child.parentNode);
	}
	else {
		return false;
	}
};

var script = document.createElement('script');
script.src = chrome.extension.getURL('instrumentation.js');

if(document.body) {
	document.body.appendChild(script);
	script.onload = function() {
		if(contains(document.body, script)) {
			document.body.removeChild(script);
		}
	};
}

window.addEventListener('message', function(event) {
	chrome.runtime.sendMessage(event.data);
});