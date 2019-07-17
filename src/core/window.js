const window = require("./helpers/window");
const createWindow = window.create;
const destoryWindow = window.destory;

// Main

class Window {
  constructor() {
    this._windows = {};
  }

  createWindow(options) {
    // Reference: https://developer.mozilla.org/ja/docs/Web/JavaScript/Guide/Using_promises
    const window = createWindow(options);
    this._windows[window.id] = window;
    window.setMenu(null);
    return window;
  }

  destoryWindow(window) {
    const id = window.id;

    if (!this._windows.hasOwnProperty(id)) {
      return false;
    }

    destoryWindow(window);
    delete this._windows[id];

    return true;
  }

  destoryAll() {
    const windows = Object.values(this._windows);

    for (let i = 0; i < windows.length; i++) {
      this.destoryWindow(windows[i]);
    }
  }
}

module.exports = Window;
