const {
  create: createWindow,
  destory: destoryWindow
} = require("./helpers/window");

// Main

class Window {
  constructor() {
    this._windows = {};
  }

  createWindow(options) {
    const self = this;

    // Reference: https://developer.mozilla.org/ja/docs/Web/JavaScript/Guide/Using_promises
    return createWindow(options).then(function(window) {
      self._windows[window.id] = window;
      window.setMenu(null);
      return Promise.resolve(window);
    });
  }

  destoryWindow(window) {
    if (this._windows[window.id] === undefined) {
      return false;
    }

    destoryWindow(window);
    delete this._windows[window.id];

    return true;
  }

  destoryAll() {
    Object.values(this._windows).forEach(function(window) {
      window.close();
    });
  }
}

module.exports = Window;
