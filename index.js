var getViewModel = function() {
	var can = window.can;

	if(can) {
		var viewModel = $0 && can.viewModel($0);

		//TODO: invoke updateElementProperties when viewModel changes

		var data = viewModel.serialize();
		data.__proto__ = null;
		return data;
	}
};

chrome.devtools.panels.elements.createSidebarPane('CanJS ViewModel',
	function(sidebar) {
		function updateElementProperties() {
			sidebar.setExpression("(" + getViewModel.toString() + ")()");
		}

		updateElementProperties();

		chrome.devtools
			.panels.elements
			.onSelectionChanged
			.addListener(updateElementProperties);
	}
);
