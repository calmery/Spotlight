const electron = require("electron");
const path = require("path");

// Helper Functions

const BrowserWindow = electron.BrowserWindow;

// Window Manager

class WindowManager {
  constructor() {
    this._windows = {};
  }

  // Private

  _overrideOptions(options) {
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

  // Public

  getById(windowId) {
    if (!this._windows.hasOwnProperty(windowId)) {
      return null;
    }

    return this._windows[windowId];
  }

  open(options) {
    options = this._overrideOptions(options);
    const window = new BrowserWindow(options);

    // バグってる
    window.on("closed", this.close.bind(this, window.id));
    window.once("ready-to-show", function() {
      window.show();
    });

    this._windows[window.id] = window;

    return window;
  }

  close(windowId) {
    console.log("Call Window clse")
    const window = this.getById(windowId);

    if (window === null) {
      return false;
    }

    if (!window.isDestroyed()) {
      window.close();
    }

    delete this._windows[windowId];

    console.log(this._windows)

    return true;
  }

  closeAll() {
    for (const windowId in this._windows) {
      this.close(windowId);
    }
  }
}

// Exports

module.exports = WindowManager;
