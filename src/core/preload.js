const electron = require("electron");
const IPC = require("./IPC");

process.once("loaded", function() {
  global.application = electron.remote.getGlobal(IPC.RUNNING_APPLICATIONS_REFERENCES)[
    electron.ipcRenderer.sendSync(
      IPC.GET_APPLICATION_NAME,
      window.location.port
    )
  ];
});
