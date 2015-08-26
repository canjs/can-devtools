/*
 * instrumentation -> content-script.js -> background.js -> ui
 */
window.addEventListener('message', function(event) {
  // console.log('-> Content Script', event.data);
  var message = event.data;

  // Only accept messages of correct format (our messages)
  if (typeof message !== 'object' || message === null ||
      message.source !== 'can-devtools-instrumentation') {
      // console.log('content-script:', 'message format is invalid', message);
    return;
  }

  // console.log('Content Script -> Background:', message);
  chrome.runtime.sendMessage(message);
});


/*
 * instrumentation <- content-script.js <- background.js <- ui
 */
chrome.runtime.onMessage.addListener(function(request) {
  // console.log('Content Script -> Instrumentation:', request);
  request.source = 'can-devtools-content-script';
  window.postMessage(request, '*');
});