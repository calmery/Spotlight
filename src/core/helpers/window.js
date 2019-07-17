const { app, BrowserWindow } = require("electron");

function create(options) {
  options = options || {};
  options.show = false;

  const window = new BrowserWindow(options);

  window.once("ready-to-show", function() {
    window.show();
  });

  return window;
}

function destory(main) {
  main.close();
}

// electron でウインドウが作成できるようになるまで待機する
function wait() {
  return new Promise(function(resolve) {
    if (app.isReady()) {
      resolve();
      return;
    }

    app.on("ready", function() {
      resolve();
    });
  });
}

module.exports = {
  create,
  destory,
  wait
};
