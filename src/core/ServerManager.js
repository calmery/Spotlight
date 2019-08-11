const cors = require("cors");
const express = require("express");

// Server Manager

class ServerManager {
  constructor(port) {
    this._express = express();
    this._server = this._express.listen(port);
    this._port = this._server.address().port;
    this._express.use(cors());
  }

  // Public

  close() {
    this._server.close();
  }

  getHost() {
    return `127.0.0.1:${this.getPort()}`;
  }

  getPort() {
    return this._port;
  }

  getUrl() {
    return `http://${this.getHost()}`;
  }

  // Routing

  use(...args) {
    return this._express.use(...args);
  }

  // app.get(route, function)
  get(...args) {
    console.log("Get")
    return this._express.get(...args);
  }

  // app.post( route, function )
  post(...args) {
    return this._express.post(...args);
  }

  // app.put( route, function )
  put(...args) {
    return this._express.put(...args);
  }

  // app.delete( route, function )
  delete(...args) {
    return this._express.delete(...args);
  }
}

// Exports

module.exports = ServerManager;
