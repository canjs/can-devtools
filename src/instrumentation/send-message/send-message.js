var sendMessage = function(name, data) {
  // console.log('Instrumentation -> Content Script:', name, data || {});
  window.postMessage({
    source: 'can-devtools-instrumentation',
    name: name,
    data: data || {}
  }, '*');
};

export default sendMessage;