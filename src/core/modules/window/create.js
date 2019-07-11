const { app, BrowserWindow } = require("electron");

const create = options => {
  options = options || {};
  options.show = false;

  const window = new BrowserWindow(options);

  window.once("ready-to-show", () => {
    window.show();
  });

  return window;
};

module.exports = options => {
  return new Promise(resolve => {
    if (app.isReady() === true) {
      resolve(create(options));
    } else {
      app.on("ready", () => {
        resolve(create(options));
      });
    }
  });
};
