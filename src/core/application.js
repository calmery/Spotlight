const Events = require("events");
const express = require("express");
const path = require("path");
const Storage = require("./storage");
const Server = require("./server");
const Window = require("./window");
const file = require("./helpers/file");
const utility = require("./helpers/utility");

// Helper Functions

function log(applicationName, message) {
  utility.log("green", `Application:${applicationName}`, message);
}

function errorLog(applicationName, message) {
  utility.log("red", `Application:${applicationName}`, message);
}

// Main

class Application extends Events {
  constructor(options) {
    super();

    this._name = options.name;
    this._path = options.path;
    this._alreadyClosed = false;
    this._isFocused = true; // 起動時点ではフォーカスされている

    // Application

    this.openApplication = options.openApplication;
    this.exitApplication = options.exitApplication;

    // Storage

    this._storage = new Storage(this._name);
    this._sharedStorage = new Storage();

    // Server

    this._server = new Server();
    this._alreadyBeenActioneded = false; // 既にウインドウの作成，サーバへのルーティングを行なっている場合は Port の変更を許可しない
    this._setStaticPath();

    // Window

    this._window = new Window();
  }

  // Private

  _setStaticPath() {
    // アプリケーション内に static フォルダがあれば使用する
    const staticPath = path.resolve(this._path, "static");
    if (file.exists(staticPath)) {
      this._server.use(express.static(staticPath));
    }

    // 共通の静的ファイルがあれば使用する
    const commonStaticPath = path.resolve(__dirname, "../static");
    this._server.use(express.static(commonStaticPath));
  }

  _handleWindowFocus() {
    const isFocused = this._window.isFocused();
    if (isFocused !== this._isFocused) {
      this._isFocused = isFocused;

      if (isFocused) {
        this.emit("focus");
      } else {
        this.emit("blur");
      }
    }
  }

  _handleWindowClose() {
    // 全てのウインドウが閉じられた場合はアプリケーションを終了する
    if (this._window.getCount() === 0) {
      this.exit();
    }
  }

  // Control

  exit() {
    if (this._alreadyClosed) {
      return;
    }

    this._alreadyClosed = true;
    this.emit("exit");
    this._server.close();
    this._window.destoryAll();

    log(this._name, "Application has been closed");
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

  // Window

  createWindow(options) {
    this._alreadyBeenActioned = true;

    if (this._alreadyClosed) {
      errorLog(this._name, "The application is already closed");
      return;
    }

    const window = this._window.create(options);
    window.loadURL(this.getUrl());
    window.on("focus", this._handleWindowFocus.bind(this));
    window.on("blur", this._handleWindowFocus.bind(this));
    window.on("close", this._handleWindowClose.bind(this));

    log(this._name, "The window has been created");

    return window;
  }

  createFixedSizeWindow(options) {
    options = options || {};
    options.width = options.width || 800;
    options.height = options.height || 600;

    const window = this.createWindow(options);
    window.setMaximumSize(200, 600);
    window.setMinimumSize(200, 600);

    return window;
  }

  destoryWindow(window) {
    if (this._window.destory(window)) {
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
