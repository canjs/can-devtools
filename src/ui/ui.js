import can from 'can';
import injectInstrumentation from 'src/ui/inject/';
import Bridge from 'src/ui/bridge/';
import AppViewModel from "src/ui/models/app/";
import {list as dataSources} from 'src/ui/data-sources/';

import template from 'src/ui/index.stache!';

var initialData = {
	data: {}
};
dataSources.forEach(function(source) {
	initialData.data[source] = {};
	initialData[source] = [];
});

var appViewModel = window.appViewModel = new AppViewModel(initialData);

new Bridge(appViewModel);

injectInstrumentation();

can.$('body').append(template(appViewModel));