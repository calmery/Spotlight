const Core = require("./core");
const core = new Core();

core.addListener("ready", function() {
  const manager = core.openApplication("controller");
  manager.openWindow().openDevTools();
});
