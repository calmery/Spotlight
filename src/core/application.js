const express = require("express");
const { debug, absolutePath } = require("./helpers/utility");
const {
  create: createWindow,
  destory: destoryWindow
} = require("./helpers/window");
const { exists } = require("./helpers/file");
const Storage = require("./storage");

// Helper functions

function log(message) {
  return debug("green", "Application", message);
}

function errorLog(message) {
  return debug("red", "Application", message);
}

// Main

class Application {
  constructor(options) {
    this._name = options.name;
    this._currentDirectory = options.currentDirectory;
    this._alreadyClosed = false;

    // Storage

    this._sharedStorage = new Storage();
    this._storage = new Storage(this._name);

    // Express

    this._express = express();
    this._server = this._express.listen();
    this._port = this._server.address().port;
    this._alreadyBeenActioneded = false; // 既にウインドウの作成，サーバへのルーティングを行なっている場合は Port の変更をさせない
    this._setStaticPath();

    // Electron

    this._windows = {};
  }

  // Private

  _setStaticPath() {
    const commonStaticPath = absolutePath(__dirname, "../static");
    this._express.use(express.static(commonStaticPath));

    const staticPath = absolutePath(this._currentDirectory, "static");
    if (exists(staticPath)) {
      this._express.use(express.static(staticPath));
    }
  }

  // Express

  getHost() {
    return `127.0.0.1:${this.getPort()}`;
  }

  getPort() {
    return this._port;
  }

  getUrl() {
    return `http://${this.getHost()}`;
  }

  use(...args) {
    this._alreadyBeenActioned = true;
    this._express.use(...args);
  }

  get(url, handler) {
    this._alreadyBeenActioned = true;
    this._express.get(url, handler);
  }

  post(url, handler) {
    this._alreadyBeenActioned = true;
    this._express.get(url, handler);
  }

  put(url, handler) {
    this._alreadyBeenActioned = true;
    this._express.get(url, handler);
  }

  delete(url, handler) {
    this._alreadyBeenActioned = true;
    this._express.get(url, handler);
  }

  setPort(port) {
    if (this._alreadyBeenActioned) {
      errorLog(
        "Port configuration must be done before configuring the HTTP request method"
      );
      return;
    }

    const _express = express();

    try {
      const _server = _express.listen(port);

      log(`Change port ${this._port} to ${port}`);

      this._express = _express;
      this._server = _server;
      this._port = port;
      this._setStaticPath();
    } catch (_) {
      errorLog(`Port (${port}) is already in use`);
    }
  }

  // Electron

  createWindow(options) {
    const self = this;

    // Reference: https://developer.mozilla.org/ja/docs/Web/JavaScript/Guide/Using_promises
    return createWindow(options).then(function(window) {
      // ウインドウの作成中にアプリケーションが閉じられた場合にウインドウのみ表示されてしまうので対策する
      if (self._alreadyClosed) {
        window.close();
        errorLog("The application is already closed");
        return Promise.reject();
      }

      self._windows[window.id] = window;
      self._alreadyBeenActioned = true;
      log("createWindow(options): The window has been created");
      window.setMenu(null);
      return Promise.resolve(window);
    });
  }

  destoryWindow(window) {
    if (this._windows[window.id] === undefined) {
      errorLog("destoryWindow(window): The window is not found");
      return;
    }

    destoryWindow(window);
    delete this._windows[window.id];

    log("destoryWindow(window): The window has been destoryed");
  }

  // Storage

  saveSharedAppData(filePath, body) {
    return this._sharedStorage.saveAppData(filePath, body);
  }

  loadSharedAppData(filePath) {
    return this._sharedStorage.loadAppData(filePath);
  }

  saveSharedDocuments(filePath, body) {
    return this._sharedStorage.saveDocuments(filePath, body);
  }

  loadSharedDocuments(filePath) {
    return this._sharedStorage.loadDocuments(filePath);
  }

  saveAppData(filePath, body) {
    return this._storage.saveAppData(filePath, body);
  }

  loadAppData(filePath) {
    return this._storage.loadAppData(filePath);
  }

  saveDocuments(filePath, body) {
    return this._storage.saveDocuments(filePath, body);
  }

  loadDocuments(filePath) {
    return this._storage.loadDocuments(filePath);
  }

  // Manage

  close() {
    this._alreadyClosed = true;
    this._server.close();
    Object.keys(this._windows).forEach(function(window) {
      window.close();
    });
  }
}

module.exports = Application;
