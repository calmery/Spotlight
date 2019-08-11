const Events = require("events");
const express = require("express");
const path = require("path");
const ServerManager = require("./ServerManager");
const StorageManager = require("./StorageManager");
const WindowManager = require("./WindowManager");

// Application Manager

class Application extends Events {
  constructor(options) {
    super();

    this.openApplication = options.openApplication;
    this.closeApplication = options.closeApplication;

    this._name = options.name;
    this._alreadyBeenActioneded = false;
    this._alreadyClosed = false;
    this._serverManager = new ServerManager(options.port);
    this._storageManager = new StorageManager();
    this._windowManager = new WindowManager();

    // Extra
    this._extraServers = {};

    this._serveStatic();
  }

  // Private

  _getApplicationPath() {
    return path.resolve(__dirname, "../applications/", this._name);
  }

  _serveStatic() {
    const applicationPath = this._getApplicationPath();
    this._serverManager.use(express.static(applicationPath));

    const commonPath = path.resolve(__dirname, "../static");
    this._serverManager.use(express.static(commonPath));
  }

  // Public

  changePort(port) {
    if (this._alreadyBeenActioneded) {
      return;
    }

    try {
      const serverManager = new ServerManager(port);
      this._serverManager = serverManager;
      this._serveStatic();
    } catch (_) {}
  }

  openExtraServer(port) {
    const server = new ServerManager(port);
    this._extraServers[server.getPort()] = server;
  }

  closeExtraServer(server) {
    const port = server.getPort();
    server.close();
    delete this._extraServers[port];
  }

  close() {
    this._alreadyClosed = true;
    this._serverManager.close();
    this._windowManager.closeAll();
    const self = this;
    Object.values(this._extraServers).forEach(function(extraServer) {
      self.closeExtraServer(extraServer)
    })
    this.emit("close");
  }

  closeWindow(windowId) {
    if (this._windowManager.close(windowId)) {
      return;
    }
  }

  getHost() {
    return this._serverManager.getHost();
  }

  getPort() {
    return this._serverManager.getPort();
  }

  getUrl() {
    return this._serverManager.getUrl();
  }

  openWindow(options) {
    this._alreadyBeenActioned = true;

    if (this._alreadyClosed) {
      return;
    }

    const window = this._windowManager.open(options);
    window.loadURL(this.getUrl());

    return window;
  }

  // Storage

  saveAppData(filePath, body) {
    return this._storageManager.saveAppData(filePath, body);
  }

  loadAppData(filePath) {
    return this._storageManager.loadAppData(filePath);
  }

  removeAppData(filePath) {
    return this._storageManager.removeAppData(filePath);
  }

  saveDocuments(filePath, body) {
    return this._storageManager.saveDocuments(filePath, body);
  }

  loadDocuments(filePath) {
    return this._storageManager.loadDocuments(filePath);
  }

  removeDocuments(filePath) {
    return this._storageManager.removeDocuments(filePath);
  }
}

// Exports

module.exports = Application;
