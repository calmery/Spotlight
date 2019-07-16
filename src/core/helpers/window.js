const { app, BrowserWindow } = require("electron");

function createHelper(options) {
  options = options || {};
  options.show = false;

  const window = new BrowserWindow(options);

  window.once("ready-to-show", () => {
    window.show();
  });

  return window;
}

function create(options) {
  return new Promise(resolve => {
    if (app.isReady() === true) {
      resolve(createHelper(options));
    } else {
      app.on("ready", () => {
        resolve(createHelper(options));
      });
    }
  });
}

function destory(main) {
  main.close();
}

module.exports = {
  create,
  destory
};
