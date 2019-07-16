const express = require("express");
const { debug, absolutePath } = require("./helpers/utility");
const {
  create: createWindow,
  destory: destoryWindow
} = require("./helpers/window");
const { exists } = require("./helpers/file");
const Storage = require("./storage");
const Server = require("./server");

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

    // Server

    this._server = new Server();
    this._alreadyBeenActioneded = false; // 既にウインドウの作成，サーバへのルーティングを行なっている場合は Port の変更をさせない
    this._setStaticPath();

    // Electron

    this._windows = {};
  }

  // Private

  _setStaticPath() {
    const commonStaticPath = absolutePath(__dirname, "../static");
    this._server.use(express.static(commonStaticPath));

    const staticPath = absolutePath(this._currentDirectory, "static");
    if (exists(staticPath)) {
      this._server.use(express.static(staticPath));
    }
  }

  // Express

  getHost() {
    return this._server.getHost();
  }

  getPort() {
    return this._server.getPort();
  }

  getUrl() {
    return this._server.getUrl();
  }

  use(...args) {
    this._alreadyBeenActioned = true;
    this._server.use(...args);
  }

  get(...args) {
    this._alreadyBeenActioned = true;
    this._server.get(...args);
  }

  post(...args) {
    this._alreadyBeenActioned = true;
    this._server.post(...args);
  }

  put(...args) {
    this._alreadyBeenActioned = true;
    this._server.put(...args);
  }

  delete(...args) {
    this._alreadyBeenActioned = true;
    this._server.delete(...args);
  }

  setPort(port) {
    if (this._alreadyBeenActioned) {
      errorLog(
        "Port configuration must be done before configuring the HTTP request method"
      );
      return;
    }

    try {
      const server = new Server(port);

      log(`Change port ${this.getPort()} to ${port}`);

      this._server = server;
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
