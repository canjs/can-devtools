var send = function(vm) {
	window.postMessage({
		viewModel: vm
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

		send(vm.serialize());
	}
},

update = function(el, data) {
	var vm = can.viewModel(el);

	if(vm) {
		vm.attr(data);
	}
};