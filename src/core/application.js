const { debug } = require("./helpers/utility");
const {
  create: createWindow,
  destory: destoryWindow
} = require("./helpers/window");

const DEBUG_COLOR_WINDOW_ERROR = "red";
const DEBUG_COLOR_WINDOW_SUCCESS = "green";

// Private members

const store = new WeakMap();

// Main

// constructor でコールバックを受け取るようにする

class Application {
  constructor(core) {
    store.set(this, { core });

    this._windows = {};
  }

  createWindow(options) {
    const self = this;

    // Reference: https://developer.mozilla.org/ja/docs/Web/JavaScript/Guide/Using_promises
    return createWindow(options)
      .then(function(window) {
        self._windows[window.id] = window;
        debug(DEBUG_COLOR_WINDOW_SUCCESS, "Application", "createWindow(options): The window has been created");
        return Promise.resolve(window.id);
      });
  }

  destoryWindow(windowId) {
    const window = this._windows[windowId];

    if (window === undefined) {
      return false;
    }

    destoryWindow(window);
    debug(DEBUG_COLOR_WINDOW_SUCCESS, "Application", "destoryWindow(windowId): The window has been destoryed");
    delete this._windows[windowId];

    return true;
  }

  close() {}
}

module.exports = Application;
