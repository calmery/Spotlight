const { debug } = require("./helpers/utility");
const {
  create: createWindow,
  destory: destoryWindow
} = require("./helpers/window");

const DEBUG_COLOR_WINDOW = "red";

// Private members

const store = new WeakMap();

// Main

// constructor でコールバックを受け取るようにする

class Application {
  constructor(app) {
    store.set(this, { app });
  }

  createWindow(options) {
    debug(DEBUG_COLOR_WINDOW, "", "");
    return createWindow(options);
  }

  close() {}
}

module.exports = Application;
