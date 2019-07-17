const path = require("path");
const utility = require("./helpers/utility");
const file = require("./helpers/file");
const window = require("./helpers/window");
const Application = require("./application");

// Helper Functions

function log(message) {
  utility.log("green", "Core", message);
}

function errorLog(message) {
  utility.log("red", "Core", message);
}

// Main

class Core {
  constructor() {
    // 起動済みのアプリケーションの情報を保持する
    this.applications = {};
  }

  async openApplication(applicationName) {
    await window.wait();

    if (applicationName === undefined) {
      errorLog("Application name invalid");
      return;
    }

    const applicationPath = path.resolve(
      __dirname,
      "../applications/",
      applicationName
    );

    if (!file.exists(applicationPath)) {
      errorLog(`Application (${applicationName}) is not found`);
      return;
    }

    if (this.applications[applicationName] !== undefined) {
      errorLog(`Application (${applicationName}) is already opened`);
      return;
    }

    try {
      this.applications[applicationName] = new Application(this, {
        name: applicationName,
        currentDirectory: path.resolve(
          __dirname,
          `../applications/${applicationName}`
        )
      });

      const self = this;

      // アプリケーションから close が呼ばれたときに終了の処理を行う
      this.applications[applicationName].on("close", function() {
        delete self.applications[applicationName];
        log(`Application (${applicationName}) has been closed`);
      });

      log(`Application (${applicationName}) has been opened`);

      require(applicationPath)(this.applications[applicationName]);
    } catch (_) {
      delete this.applications[applicationName];
      errorLog(`Application (${applicationName}) structure is incorrect`);
    }
  }

  closeApplication(applicationName) {
    if (applicationName === undefined) {
      errorLog("Application name invalid");
      return;
    }

    const applicationPath = path.resolve(
      __dirname,
      "../applications/",
      applicationName
    );

    // アプリケーションの実行ファイルが見つからない
    if (!file.exists(applicationPath)) {
      errorLog(`Application (${applicationName}) is not found`);
      return;
    }

    // アプリケーションが起動していない
    if (!this.applications.hasOwnProperty(applicationName)) {
      errorLog(`Application (${applicationName}) has not been opened`);
      return;
    }

    this.applications[applicationName].close();
    delete this.applications[applicationName];

    log(`Application (${applicationName}) has been closed`);
  }
}

module.exports = Core;
