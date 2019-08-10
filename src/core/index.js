const Events = require("events");
const path = require("path");
const Application = require("./application");
const file = require("./helpers/file");
const utility = require("./helpers/utility");
const window = require("./helpers/window");

// Helper Functions

function log(message) {
  utility.log("green", "Core", message);
}

function errorLog(message) {
  utility.log("red", "Core", message);
}

// Main

class Core extends Events {
  constructor() {
    super();

    this._runningApplications = {};
    this._hasCompletedWindowPreparation = false;
    this._applicationDirectoryPath = path.resolve(
      __dirname,
      "../applications/"
    );

    const self = this;

    // ウインドウ生成の準備が完了するまで待機し，準備が完了した時点で ready イベントを送信する
    window.waitUntilReady().then(function() {
      log("Ready");
      self._hasCompletedWindowPreparation = true;
      self.emit("ready");
    });

    // プロセスが終了する際に，実行中のアプリケーション全てに exit イベントを送信する
    process.on("exit", function() {
      for (const application in this._runningApplications) {
        application.emit("exit");
      }
      log("Exit");
      self.emit("exit");
    });
  }

  // Private methods

  _existApplication(applicationName) {
    const maybeApplicationNames = file.getDirectories(
      this._applicationDirectoryPath
    );

    const self = this;
    return maybeApplicationNames.some(function(maybeApplicationName) {
      const applicationEntryPoint = path.resolve(
        self._getApplicationPath(maybeApplicationName),
        "index.js"
      );

      return (
        // アプリケーションのエントリーポイントとして index.js が存在することを確認する
        file.exists(applicationEntryPoint) &&
        maybeApplicationName === applicationName
      );
    });
  }

  _exitApplication(applicationName) {
    const application = this._getRunningApplication(applicationName);

    if (application === null) {
      return;
    }

    // アプリケーションに登録されている全てのイベントを削除し，実行中のアプリケーションの一覧から削除する
    application.removeAllListeners();
    application.exit();
    delete this._runningApplications[applicationName];
  }

  _getApplicationPath(applicationName) {
    return path.resolve(this._applicationDirectoryPath, applicationName);
  }

  _getRunningApplication(applicationName) {
    if (!this._runningApplications.hasOwnProperty(applicationName)) {
      return null;
    }

    return this._runningApplications[applicationName];
  }

  // Public methods

  isReady() {
    return this._hasCompletedWindowPreparation;
  }

  openApplication(applicationName) {
    if (!this._hasCompletedWindowPreparation) {
      errorLog("Not completed preparation");
      return;
    }

    if (applicationName === undefined) {
      errorLog("Application name invalid");
      return;
    }

    if (!this._existApplication(applicationName)) {
      errorLog(`Application (${applicationName}) is not found`);
      return;
    }

    if (this._getRunningApplication(applicationName) !== null) {
      errorLog(`Application (${applicationName}) is already opened`);
      return;
    }

    const applicationPath = this._getApplicationPath(applicationName);
    const application = new Application({
      name: applicationName,
      path: applicationPath,
      openApplication: this.openApplication.bind(this),
      exitApplication: this.exitApplication.bind(this)
    });

    this._runningApplications[applicationName] = application;

    // アプリケーションにイベントを登録する
    application.addListener(
      "exit",
      this._exitApplication.bind(this, applicationName)
    );

    try {
      require(applicationPath)(application);
      log(`Application (${applicationName}) has been opened`);
    } catch (error) {
      this._exitApplication(applicationName);
      errorLog(
        `Application (${applicationName}) structure is incorrect\n\tError: ${
          error.message
        }`
      );
      return;
    }

    return application;
  }

  exitApplication(applicationName) {
    if (applicationName === undefined) {
      errorLog("Application name invalid");
      return;
    }

    if (!this._existApplication(applicationName)) {
      errorLog(`Application (${applicationName}) is not found`);
      return;
    }

    const application = this._getRunningApplication(applicationName);
    if (application === null) {
      errorLog(`Application (${applicationName}) has not been opened`);
      return;
    }

    this._exitApplication(applicationName);

    log(
      `A request has been sent to terminate application (${applicationName})`
    );
  }
}

module.exports = Core;
