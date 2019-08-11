const electron = require("electron");

// Reference: https://electronjs.org/docs/api/process#event-loaded
process.once("loaded", function() {
  // Reference: https://electronjs.org/docs/api/remote#remotegetglobalname
  global.controller = electron.remote.getGlobal("controller");
});
