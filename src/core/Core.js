const electron = require("electron");
const Events = require("events");
const fs = require("fs");
const path = require("path");
const IPC = require("./IPC");
const helpers = require("./helpers");

// Helper Functions

function log(message) {
  helpers.log("green", "Core", message);
}

function errorLog(message) {
  helpers.log("red", "Core", message);
}


const ipcMain = electron.ipcMain;

function getDirectories(directoryPath) {
  if (!path.isAbsolute(directoryPath)) {
    return null;
  }

  const directoryNames = [];
  const fileOrDirectoryNames = fs.readdirSync(directoryPath);

  fileOrDirectoryNames.forEach(function(fileOrDirectoryName) {
    const fileOrDirectoryPath = path.resolve(
      directoryPath,
      fileOrDirectoryName
    );

    if (fs.statSync(fileOrDirectoryPath).isDirectory()) {
      directoryNames.push(fileOrDirectoryName);
    }
  });

  return directoryNames;
}

function waitUntilElectronReady() {
  const app = electron.app;

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

const Application = require("./Application");

// Main

class Core extends Events {
  constructor() {
    super();

    global[IPC.RUNNING_APPLICATIONS_REFERENCES] = this._runningApplications = {};
    this._hasCompletedWindowPreparation = false;
    this._applicationDirectoryPath = path.resolve(
      __dirname,
      "../applications/"
    );

    this._setupEvents();
    this._setupIPC();
  }

  // Private

  _existApplication(applicationName) {
    const applicationNames = getDirectories(this._applicationDirectoryPath);

    return applicationNames.includes(applicationName);
  }

  _getApplicationPath(applicationName) {
    return path.resolve(this._applicationDirectoryPath, applicationName);
  }

  _getApplicationNameFromPort(port) {
    const self = this;

    return Object.keys(this._runningApplications).find(function(
      applicationName
    ) {
      return (
        self._runningApplications[applicationName].getPort().toString() === port
      );
    });
  }

  _getRunningApplication(applicationName) {
    if (!this._runningApplications.hasOwnProperty(applicationName)) {
      return null;
    }

    return this._runningApplications[applicationName];
  }

  _setupEvents() {
    const self = this;

    waitUntilElectronReady().then(function() {
      self._hasCompletedWindowPreparation = true;
      self.emit("ready");
    });
  }

  _setupIPC() {
    const self = this;

    ipcMain.on(IPC.GET_APPLICATION_NAME, function(events, port) {
      const applicationName = self._getApplicationNameFromPort(port);
      events.returnValue = applicationName;
    });
  }

  // Public

  isReady() {
    return this._hasCompletedWindowPreparation;
  }

  openApplication(applicationName, port) {
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

    const application = new Application({
      name: applicationName,
      port,
      openApplication: this.openApplication.bind(this),
      closeApplication: this.closeApplication.bind(this)
    });

    const self = this;
    application.on("close", function() {
      application.removeAllListeners();
      delete self._runningApplications[applicationName];
    });

    this._runningApplications[applicationName] = application;

    log(`Application (${applicationName}) has been opened`);

    return application;
  }

  closeApplication(applicationName) {
    if (applicationName === undefined) {
      errorLog("Application name invalid");
      return;
    }

    if (!this._existApplication(applicationName)) {
      errorLog(`Application (${applicationName}) is not found`);
      return;
    }

    const applicationManager = this._getRunningApplication(applicationName);
    if (applicationManager === null) {
      return;
    }

    applicationManager.removeAllListeners();
    applicationManager.close();
    delete this._runningApplications[applicationName];

    log(
      `A request has been sent to terminate application (${applicationName})`
    );
  }
}

// Exports

module.exports = Core;
