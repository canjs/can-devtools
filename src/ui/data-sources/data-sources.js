import can from 'can';
import sendMessage from 'can-devtools/ui/send-message/';
import {parse, compose, omit} from 'can-devtools/ui/util/object';
import deepEqual from 'deep-equal';

var dataToSend = {};
var sendTimer;
var batchedSend = function(data) {
	//!steal-remove-start
	console.log('UI: attempting to send', data);
	//!steal-remove-end
	can.extend(true, dataToSend, data);
	window.clearTimeout(sendTimer);
	sendTimer = window.setTimeout(function() {
		//!steal-remove-start
		console.log('UI: finally sending', dataToSend);
		//!steal-remove-end
		sendMessage('update', dataToSend);
		dataToSend = {};
	}, 10);
}

var sources = {
	viewModel: {
		// bridge -> UI
		convert: function(newVal) {
			return parse(newVal.serialize());
		},
		// UI -> bridge
		serialize: function(curVal) {
			return compose(curVal.attr());
		}
	}
};

var sourceList = Object.keys(sources);

var uiBatchNum = null;
var instBatchNum = null;
var updateTimer;
var propsToOmit = ['__bindEvents', '_bubbleBindings', '_cid', '_data', '_computedBindings', '_bindings'];

export function bind(appViewModel) {

	var data = appViewModel.data;

	list.forEach(function(name) {

		//Instrumentation -> UI
		data[name].bind('change', function(ev, attr, how, newVal) {

			if(!ev.batchNum || (ev.batchNum && ev.batchNum !== uiBatchNum)) {
				//!steal-remove-start
				console.log('UI: data.' + name + ':changed');
				//!steal-remove-end
				var convertedValue = sources[name].convert(appViewModel.attr('data.' + name));
				appViewModel[name].attr(convertedValue, true);

				uiBatchNum = ev.batchNum;
			}

		});

		appViewModel[name].bind('change', function(ev, attr, how, newVal) {

			if(!ev.batchNum || (ev.batchNum && ev.batchNum !== instBatchNum)) {
				window.clearTimeout(updateTimer);
				//!steal-remove-start
				console.log('UI: ' + name + ':changed');
				//!steal-remove-end
				updateTimer = window.setTimeout(function(){
					//!steal-remove-start
					console.log('UI: ' + name + ':changed (finally!)');
					//!steal-remove-end
					var serializedValue = sources[name].serialize(appViewModel.attr(name));

					if(deepEqual(serializedValue, data[name].serialize())) {
						//!steal-remove-start
						console.log('UI: ' + name + ':aborted');
						//!steal-remove-end
						return;
					}

					var message = {};
					message[name] = serializedValue;

					batchedSend(message);

					instBatchNum = ev.batchNum;
				}.bind(this), 10);
			}
		});

	});

}

//Allow updates to specific data sources
export function update(newData) {
	can.batch.start();
	Object.keys(newData).forEach(function(name) {

		if(list.indexOf(name) > -1) {
			appViewModel.data[name].attr(omit(newData[name], propsToOmit), true);
		}

	});
	can.batch.stop();
}

export const list = sourceList;