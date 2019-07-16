const express = require("express");

class Server {
  constructor(port) {
    this._express = express();
    this._server = this._express.listen(port);
    this._port = this._server.address().port;
  }

  use(...args) {
    return this._express.use(...args);
  }

  // app.get(route, function)
  get(...args) {
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

  getPort() {
    return this._port;
  }

  getUrl() {
    return `http://${this.getHost()}`;
  }

  getHost() {
    return `127.0.0.1:${this.getPort()}`;
  }

  close() {
    this._server.close();
  }
}

module.exports = Server;
