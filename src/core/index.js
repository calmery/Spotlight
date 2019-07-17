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

    // アプリケーションが存在するかどうかを確認する
    if (!file.exists(applicationPath)) {
      errorLog(`Application (${applicationName}) is not found`);
      return;
    }

    // アプリケーションが起動していないことを確認する
    if (this.applications.hasOwnProperty(applicationName)) {
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

      // アプリケーション側から module.exports された関数を呼び出す
      require(applicationPath)(this.applications[applicationName]);
    } catch (error) {
      delete this.applications[applicationName];
      errorLog(`Application (${applicationName}) structure is incorrect\n\tError: ${error.message}`);
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

    // アプリケーションが存在するかどうかを確認する
    if (!file.exists(applicationPath)) {
      errorLog(`Application (${applicationName}) is not found`);
      return;
    }

    // アプリケーションが起動していることを確認する
    if (!this.applications.hasOwnProperty(applicationName)) {
      errorLog(`Application (${applicationName}) has not been opened`);
      return;
    }

    // Application クラスの close を呼び出した上で，Core の管理，this._applications から削除する
    this.applications[applicationName].close();
    delete this.applications[applicationName];

    log(`Application (${applicationName}) has been closed`);
  }
}

module.exports = Core;
