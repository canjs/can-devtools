import can from 'can';
import sendMessage from 'can-devtools/ui/send-message/';
import {parse, compose} from 'can-devtools/ui/util/object';
import deepEqual from 'deep-equal';

var dataToSend = {};
var sendTimer;
var batchedSend = function(data) {
	// console.log('UI: attempting to send', data);
	can.extend(true, dataToSend, data);
	window.clearTimeout(sendTimer);
	sendTimer = window.setTimeout(function() {
		// console.log('UI: finally sending', dataToSend);
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

export function bind(appViewModel) {

	var data = appViewModel.data;

	list.forEach(function(name) {

		//Instrumentation -> UI
		data[name].bind('change', function(ev, attr, how, newVal) {

			if(!ev.batchNum || (ev.batchNum && ev.batchNum !== uiBatchNum)) {
				// console.log('UI: data.' + name + ':changed');
				var convertedValue = sources[name].convert(appViewModel.attr('data.' + name));
				appViewModel[name].attr(convertedValue, true);

				uiBatchNum = ev.batchNum;
			}

		});

		appViewModel[name].bind('change', function(ev, attr, how, newVal) {

			if(!ev.batchNum || (ev.batchNum && ev.batchNum !== instBatchNum)) {
				// console.log('UI: ' + name + ':changed');
				var serializedValue = sources[name].serialize(appViewModel.attr(name));

				if(deepEqual(serializedValue, data[name].serialize())) {
					// console.log('UI: ' + name + ':aborted');
					return;
				}

				var message = {};
				message[name] = serializedValue;

				batchedSend(message);

				instBatchNum = ev.batchNum;
			}

		});

	});

}

//Allow updates to specific data sources
export function update(newData) {
	can.batch.start();
	Object.keys(newData).forEach(function(name) {

		if(list.indexOf(name) > -1) {
			appViewModel.data[name].attr(newData[name], true);
		}

	});
	can.batch.stop();
}

export const list = sourceList;