const window = require("./helpers/window");
const createWindow = window.create;
const destoryWindow = window.destory;

// Main

class Window {
  constructor() {
    this._windows = {};
  }

  create(options) {
    const window = createWindow(options);
    window.setMenu(null);

    this._windows[window.id] = window;

    // ウインドウが閉じられたとき，this._windows から削除する
    const self = this;
    window.on("close", function() {
      delete self._windows[window.id];
    });

    return window;
  }

  destory(window) {
    if (window.isDestroyed()) {
      return true;
    }

    const id = window.id;

    if (!this._windows.hasOwnProperty(id)) {
      return false;
    }

    destoryWindow(window);
    delete this._windows[id];

    return true;
  }

  destoryAll() {
    for (const windowId in this._windows) {
      this.destory(this._windows[windowId]);
    }
  }

  getCount() {
    return Object.keys(this._windows).length;
  }

  isFocused() {
    const windows = Object.values(this._windows);

    return windows.some(function(window) {
      return window.isFocused();
    });
  }
}

module.exports = Window;
