var stealTools = require("steal-tools");
var argv = require('yargs').argv;

var debugBuild = argv.debug === true;

stealTools.build({
  config: __dirname + "/package.json!npm",
  main: 'src/ui/',
  bundlesPath: 'chrome_extension/dist'
}, {
	minify: false,
	bundleSteal: true,
  removeDevelopmentCode: !debugBuild
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
    standalone: {
      format: "global",
      modules: ["src/instrumentation/"],
      dest: __dirname+"/chrome_extension/dist/instrumentation/instrumentation.js",
      minify: false,
      removeDevelopmentCode: !debugBuild
    }
  }
});
