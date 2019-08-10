const Core = require("./core");

const core = new Core();
core.addListener("ready", main);

function main() {
  core.openApplication("controller");
}
