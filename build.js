var stealTools = require("steal-tools");

stealTools.build({
  config: __dirname + "/package.json!npm"
}, {
	minify: false,
	bundleSteal: true
});