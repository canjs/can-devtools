var getViewModel = function() {
	var can = window.can;
	var viewModel = can
		? $0 && can.viewModel($0)
		: null;

	if(viewModel) {
		var data = viewModel.serialize();
		data.__proto__ = null;

		return data;
	}
};

chrome.devtools
	.panels.elements
	.createSidebarPane('CanJS', function(sidebar) {
	var updateElementProperties = function() {
		sidebar.setExpression('(' + getViewModel.toString() + ')()', 'ViewModel');
	};

	updateElementProperties();

	chrome.devtools
		.panels.elements
		.onSelectionChanged
		.addListener(updateElementProperties);
});
