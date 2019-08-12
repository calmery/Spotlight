const electron = require("electron");
const server = require("./server");
const storage = require("./storage");
const window = require("./window");

function createWindow(url, options) {
  // 指定された URL が相対パスの場合，`getUrl()` 関数で得られる URL と連結する
  // createWindow("controller.html") の場合は `http://127.0.0.1:60321/controller.html` となる
  return window.create(new URL(url, server.getUrl()).href, options);
}

function close() {
  electron.app.exit(0);
}

function restart() {
  electron.app.relaunch();
  electron.app.exit(0);
}

// Reference: https://nodejs.org/api/globals.html
global.controller = {
  createWindow: createWindow,
  destroyWindow: window.destroy,
  close: close,
  restart: restart,
  saveAppData: storage.saveAppData,
  loadAppData: storage.loadAppData,
  removeAppData: storage.removeAppData,
  saveDocuments: storage.saveDocuments,
  loadDocuments: storage.loadDocuments,
  removeDocuments: storage.removeDocuments,
  ready: window.ready
};
