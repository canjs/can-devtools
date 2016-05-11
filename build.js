var stealTools = require("steal-tools");
var argv = require('yargs').argv;

var debugBuild = argv.debug === true;

// stealTools.build({
//   config: __dirname + "/package.json!npm",
//   main: 'src/ui/',
//   bundlesPath: 'chrome_extension/dist'
// }, {
// 	minify: false,
// 	bundleSteal: true,
//   removeDevelopmentCode: !debugBuild
// });

stealTools.export({
	system: {
		config: __dirname + "/package.json!npm",
		main: 'src/ui/'
	},
	options: {
    verbose: true
  },
  outputs: {
    ui: {
			ignore: [function(name, load) {
				return /(\.less$|\.css$|vdom)/.test(load.address) ? true : false;
			}],
      format: "global",
      modules: ["src/ui/"],
      dest: __dirname+"/chrome_extension/dist/src/ui/ui.js",
      minify: false,
      removeDevelopmentCode: !debugBuild
    }
  }
});

stealTools.export({
  system: {
    main: "src/instrumentation/",
  	config: __dirname + "/package.json!npm",
  },
  options: {
    verbose: true
  },
  outputs: {
    instrumentation: {
      format: "global",
      modules: ["src/instrumentation/"],
      dest: __dirname+"/chrome_extension/dist/instrumentation/instrumentation.js",
      minify: false,
      removeDevelopmentCode: !debugBuild
    }
  }
});
