var send = function(vm, controls) {
	var serializedControls = [];

	for(var i = 0; i < controls.length; i++) {
		var control = JSON.parse(JSON.stringify(controls[i]));
		serializedControls.push(control);
	}

	window.postMessage({
		viewModel: vm,
		controls: serializedControls
	}, '*');
};

var cur,
updatePanel = function() {
	send(this.serialize());
};

var inspect = function(el) {
	var vm = can.viewModel(el);

	if(vm) {
		if(cur) vm.unbind('change', updatePanel);
		cur = vm;

		vm.bind('change', updatePanel);
		vm = vm.serialize();
	}

	send(vm, can.$(el).data().controls);
},

update = function(el, data) {
	var vm = can.viewModel(el);

	if(vm) {
		vm.attr(data);
	}
};