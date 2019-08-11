const express = require("express");
const cors = require("cors");

function create(port) {
  const app = express();
  const server = app.listen(port);

  // Reference: https://developer.mozilla.org/ja/docs/Web/HTTP/CORS
  // Reference: https://www.npmjs.com/package/cors
  app.use(cors());

  return {
    port: server.address().port,
    // Reference: https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Function/bind
    use: app.use.bind(app),
    get: app.get.bind(app),
    post: app.post.bind(app),
    put: app.put.bind(app),
    delete: app.delete.bind(app)
  };
}

module.exports = {
  create
};
