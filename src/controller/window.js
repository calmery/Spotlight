const electron = require("electron");
const path = require("path");

// Reference: https://electronjs.org/docs/api/browser-window#class-browserwindow
function overrideOptions(options) {
  if (options === undefined) {
    options = {};
  }

  if (!options.hasOwnProperty("webPreferences")) {
    options.webPreferences = {};
  }

  options.show = false;
  options.webPreferences.nodeIntegration = true;
  options.webPreferences.contextIsolation = false;
  options.webPreferences.preload = path.resolve(__dirname, "preload.js");

  return options;
}

function create(url, options) {
  options = overrideOptions(options);
  const window = new electron.BrowserWindow(options);

  window.once("ready-to-show", function() {
    window.show();
  });

  window.loadURL(url);

  return window;
}

function destroy(window) {
  if (!window.isDestroyed()) {
    window.close();
  }
}

function ready(callback) {
  const app = electron.app;

  if (app.isReady()) {
    callback();
    return;
  }

  app.on("ready", function() {
    callback();
  });
}

module.exports = {
  create,
  destroy,
  ready
};
