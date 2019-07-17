const window = require("./helpers/window");
const createWindow = window.create;
const destoryWindow = window.destory;

// Main

class Window {
  constructor() {
    this._windows = {};
  }

  // Private

  createWindow(options) {
    // Reference: https://developer.mozilla.org/ja/docs/Web/JavaScript/Guide/Using_promises
    const window = createWindow(options);
    this._windows[window.id] = window;
    window.setMenu(null);

    // 「x」ボタンでウインドウが閉じられたとき，this._windows から削除する
    const self = this;
    window.on("close", function() {
      delete self._windows[window.id];
    });

    return window;
  }

  destoryWindow(window) {
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
    const windows = Object.values(this._windows);

    for (let i = 0; i < windows.length; i++) {
      this.destoryWindow(windows[i]);
    }
  }

  getCount() {
    return Object.keys(this._windows).length;
  }

  isFocused() {
    const windows = Object.values(this._windows);

    return windows.every(function(window) {
      return window.isFocused();
    });
  }
}

module.exports = Window;
