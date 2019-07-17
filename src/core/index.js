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

    // プロセスが終了するときに close イベントを送出する
    const self = this;
    process.on("exit", function() {
      const applicationNames = Object.keys(self.applications);

      for (let i = 0; i < applicationNames.length; i++) {
        self.closeApplication(applicationNames[i]);
      }
    });
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

      // アプリケーションが存在する場合はアプリケーションに向けて open リクエストを送信する
      this.applications[applicationName].emit("open");

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
      });

      log(`Application (${applicationName}) has been opened`);

      // アプリケーション側から module.exports された関数を呼び出す
      require(applicationPath)(this.applications[applicationName]);

      // open イベントを送出する
      this.applications[applicationName].emit("open");
    } catch (error) {
      delete this.applications[applicationName];
      errorLog(
        `Application (${applicationName}) structure is incorrect\n\tError: ${
          error.message
        }`
      );
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

    log(
      `A request has been sent to terminate application (${applicationName})`
    );

    // Application クラスの close を呼び出した上で，Core の管理，this._applications から削除する
    this.applications[applicationName].close();
    delete this.applications[applicationName];
  }
}

module.exports = Core;
