window.steal = {
	//Really hacky way to prevent steal from appending sourceURL scripts to the page
	//which violates dev tool security rules
	instantiated: {
		"can-devtools@0.0.2#ui/styles.less!$less" : null,
		"can-devtools@0.0.2#ui/collapse/collapse.less!$less": null,
		"can-devtools@0.0.2#ui/property-tree/property-tree.less!$less": null,
		"can-devtools@0.0.2#ui/property/property.less!$less": null,
		"bundles/ui/ui.css!$css" : null
	}
}
