import can from 'can';
import injectInstrumentation from 'can-devtools/ui/inject/';
import Bridge from 'can-devtools/ui/bridge/';
import AppViewModel from "can-devtools/ui/models/app/";
import {list as dataSources} from 'can-devtools/ui/data-sources/';

import template from 'can-devtools/ui/index.stache!';

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