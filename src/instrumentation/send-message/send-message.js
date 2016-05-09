var sendMessage = function(name, data) {
	//!steal-remove-start
  console.log('Instrumentation -> Content Script:', name, data || {});
  //!steal-remove-end
  window.postMessage({
    source: 'can-devtools-instrumentation',
    name: name,
    data: data || {}
  }, '*');
};

export default sendMessage;