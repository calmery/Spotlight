const Core = require("./core");
const core = new Core();
core.addListener("ready", function() {
  core.openApplication("controller");
});
