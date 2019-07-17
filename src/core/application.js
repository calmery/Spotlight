const path = require("path");
const EventEmitter = require("events");
const express = require("express");
const utility = require("./helpers/utility");
const file = require("./helpers/file");
const Storage = require("./storage");
const Server = require("./server");
const Window = require("./window");

// Helper Functions

function log(applicationName, message) {
  utility.log("green", `Application:${applicationName}`, message);
}

function errorLog(applicationName, message) {
  utility.log("red", `Application:${applicationName}`, message);
}

// Main

class Application extends EventEmitter {
  constructor(core, options) {
    super();

    this._core = core;
    this._name = options.name;
    this._currentDirectory = options.currentDirectory;
    this._alreadyClosed = false;
    this._isFocused = true; // 起動時点ではフォーカスされている

    // Storage

    this._sharedStorage = new Storage();
    this._storage = new Storage(this._name);

    // Server

    this._server = new Server();
    this._alreadyBeenActioneded = false; // 既にウインドウの作成，サーバへのルーティングを行なっている場合は Port の変更を許可しない
    this._setStaticPath();

    // Window

    this._window = new Window();
  }

  // Private

  _setStaticPath() {
    // 共通の静的ファイルがあれば使用する
    const commonStaticPath = path.resolve(__dirname, "../static");
    this._server.use(express.static(commonStaticPath));

    // アプリケーション内に static フォルダがあれば使用する
    const staticPath = path.resolve(this._currentDirectory, "static");
    if (file.exists(staticPath)) {
      this._server.use(express.static(staticPath));
    }
  }

  _handleFocus() {
    const isFocused = this._window.isFocused();
    if (isFocused !== this._isFocused) {
      this._isFocused = isFocused;
      this.emit(isFocused ? 'focus' : 'blur');
    }
  }

  // Control

  close() {
    this._server.close();
    this._window.destoryAll();
    this._alreadyClosed = true;
    this.emit("close");
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
    utility.log("blue", `Application:${this._name}`, message);
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
        this._name,
        "Port configuration must be done before configuring the HTTP request method"
      );
      return;
    }

    try {
      const server = new Server(port);

      log(this._name, `Change port ${this.getPort()} to ${port}`);

      this._server = server;
      this._setStaticPath();
    } catch (_) {
      errorLog(this._name, `Port (${port}) is already in use`);
    }
  }

  // Electron

  createWindow(options) {
    this._alreadyBeenActioned = true;

    if (this._alreadyClosed) {
      errorLog(this._name, "The application is already closed");
      return;
    }

    const window = this._window.createWindow(options);
    window.loadURL(this.getUrl());
    window.on('focus', this._handleFocus.bind(this))
    window.on('blur', this._handleFocus.bind(this))

    log(this._name, "The window has been created");

    return window;
  }

  destoryWindow(window) {
    if (this._window.destoryWindow(window)) {
      log(this._name, "The window has been destoryed");
      return;
    }

    errorLog(this._name, "The window is not found");
  }

  // Storage (Shared)

  saveSharedAppData(filePath, body) {
    return this._sharedStorage.saveAppData(filePath, body);
  }

  loadSharedAppData(filePath) {
    return this._sharedStorage.loadAppData(filePath);
  }

  removeSharedAppData(filePath) {
    return this._sharedStorage.removeAppData(filePath);
  }

  saveSharedDocuments(filePath, body) {
    return this._sharedStorage.saveDocuments(filePath, body);
  }

  loadSharedDocuments(filePath) {
    return this._sharedStorage.loadDocuments(filePath);
  }

  removeSharedDocuments(filePath) {
    return this._sharedStorage.removeDocuments(filePath);
  }

  // Storage

  saveAppData(filePath, body) {
    return this._storage.saveAppData(filePath, body);
  }

  loadAppData(filePath) {
    return this._storage.loadAppData(filePath);
  }

  removeAppData(filePath) {
    return this._storage.removeAppData(filePath);
  }

  saveDocuments(filePath, body) {
    return this._storage.saveDocuments(filePath, body);
  }

  loadDocuments(filePath) {
    return this._storage.loadDocuments(filePath);
  }

  removeDocuments(filePath) {
    return this._storage.removeDocuments(filePath);
  }
}

module.exports = Application;
