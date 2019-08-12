const electron = require("electron");
const express = require("express");
const path = require("path");
const createServer = require("./server").create;
const storage = require("./storage");
const window = require("./window");

// Server

const server = createServer();
const staticPath = path.resolve(__dirname, "../static");
server.use(express.static(staticPath));

// Controller

// `createWindow(url, options)`，または `createWindow(options)` の形で実行する
// `url` を省略した場合は `getUrl()` の結果が `url` として使用される
function createWindow(url, options) {
  if (url === undefined) {
    url = getUrl();
  }

  // 指定された URL が相対パスの場合，`getUrl()` 関数で得られる URL と連結する
  // createWindow("controller.html") の場合は `http://127.0.0.1:生成されたポート番号/controller.html` となる
  return window.create(new URL(url, getUrl()).href, options);
}

function restart() {
  electron.app.relaunch();
  close();
}

function close() {
  electron.app.exit(0);
}

function getUrl() {
  return `http://127.0.0.1:${server.port}`;
}

// Reference: https://nodejs.org/api/globals.html
global.controller = {
  createWindow: createWindow,
  destroyWindow: window.destroy,
  restart: restart,
  close: close,
  getUrl: getUrl,
  saveAppData: storage.saveAppData,
  loadAppData: storage.loadAppData,
  removeAppData: storage.removeAppData,
  saveDocuments: storage.saveDocuments,
  loadDocuments: storage.loadDocuments,
  removeDocuments: storage.removeDocuments,
  ready: window.ready
};
