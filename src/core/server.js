const express = require("express");

class Server {
  constructor(port) {
    this.app = express();
    this.server = this.app.listen(port);
    this.port = this.server.address().port;
  }

  use(...args) {
    return this.app.use(...args);
  }

  // app.get(route, function)
  get(...args) {
    return this.app.get(...args);
  }

  // app.post( route, function )
  post(...args) {
    return this.app.post(...args);
  }

  // app.put( route, function )
  put(...args) {
    return this.app.put(...args);
  }

  // app.delete( route, function )
  delete(...args) {
    return this.app.delete(...args);
  }

  getPort() {
    return this.port;
  }

  getUrl() {
    return `http://${this.getHost()}`;
  }

  getHost() {
    return `127.0.0.1:${this.getPort()}`;
  }

  getServer() {
    return this.server;
  }
}

module.exports = Server;
