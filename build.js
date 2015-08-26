var stealTools = require("steal-tools");

stealTools.build({
  config: __dirname + "/package.json!npm",
  main: 'can-devtools/ui/',
  bundlesPath: 'chrome_extension/dist'
}, {
	minify: false,
	bundleSteal: true,
});

stealTools.export({
  system: {
    main: "can-devtools/instrumentation/",
  	config: __dirname + "/package.json!npm",
  },
  options: {
    verbose: true
  },
  outputs: {
    standalone: {
      format: "global",
      modules: ["can-devtools/instrumentation/"],
      dest: __dirname+"/chrome_extension/dist/instrumentation/instrumentation.js",
      minify: false
    }
  }
});