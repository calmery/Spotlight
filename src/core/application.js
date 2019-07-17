const express = require("express");
const EventEmitter = require("events");
const { debug, absolutePath } = require("./helpers/utility");
const {
  create: createWindow,
  destory: destoryWindow
} = require("./helpers/window");
const { exists } = require("./helpers/file");
const Storage = require("./storage");
const Server = require("./server");
const Window = require("./window");

// Main

class Application extends EventEmitter {
  constructor(core, options) {
    super();

    this._core = core;
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

    // Window

    this._window = new Window();
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

  _log(message) {
    return debug("green", `Application:${this._name}`, message);
  }

  _errorLog(message) {
    return debug("red", `Application:${this._name}`, message);
  }

  // Applications

  openApplication(applicationName) {
    this._core.openApplication(applicationName);
  }

  closeApplication(applicationName) {
    this._core.closeApplication(applicationName);
  }

  // Debug

  log(message) {
    debug("blue", `Application:${this._name}`, message);
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
      this._errorLog(
        "Port configuration must be done before configuring the HTTP request method"
      );
      return;
    }

    try {
      const server = new Server(port);

      this._log(`Change port ${this.getPort()} to ${port}`);

      this._server = server;
      this._setStaticPath();
    } catch (_) {
      this._errorLog(`Port (${port}) is already in use`);
    }
  }

  // Electron

  createWindow(options) {
    const self = this;

    return this._window.createWindow(options).then(function(window) {
      // ウインドウの作成中にアプリケーションが閉じられた場合にウインドウのみ表示されてしまうので対策する
      if (self._alreadyClosed) {
        window.close();
        self._errorLog("The application is already closed");
        return Promise.reject();
      }

      self._alreadyBeenActioned = true;
      self._log("createWindow(options): The window has been created");

      window.loadURL(self.getUrl());

      return Promise.resolve(window);
    });
  }

  destoryWindow(window) {
    if (this._window.destoryWindow(window)) {
      this._log("destoryWindow(window): The window has been destoryed");
      return;
    }

    this._errorLog("destoryWindow(window): The window is not found");
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
    this._window.destoryAll();
    this.emit("close");
    this._log("Application has been closed");
  }
}

module.exports = Application;
