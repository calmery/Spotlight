const { absolutePath, debug } = require("./helpers/utility");
const { exists } = require("./helpers/file");
const Application = require("./application");

// Helper Functions

const LOG_NAME = "Core";

const log = (method, message) => {
  debug("green", LOG_NAME, `${method}: ${message}`);
};

const errorLog = (method, message) => {
  debug("red", LOG_NAME, `${method}: ${message}`);
};

const getApplicationPath = applicationName => {
  return absolutePath(__dirname, "../applications/", applicationName);
};

// Main

class Core {
  constructor() {
    this.applications = {};
  }

  openApplication(applicationName) {
    const method = `openApplication(${
      applicationName ? '"' + applicationName + '"' : ""
    })`;

    if (applicationName === undefined) {
      return errorLog(method, "Application name invalid");
    }

    const applicationPath = getApplicationPath(applicationName);

    if (!exists(applicationPath)) {
      return errorLog(method, "Application is not found");
    }

    try {
      this.applications[applicationName] = new Application({
        name: applicationName,
        currentDirectory: absolutePath(__dirname, `../applications/${applicationName}`)
      });
      require(applicationPath)(this.applications[applicationName]);
    } catch (_) {
      delete this.applications[applicationName];
      return errorLog(method, "Application structure is incorrect");
    }

    return log(method, "Application has been opened");
  }

  closeApplication(applicationName) {
    const method = `closeApplication(${
      applicationName ? '"' + applicationName + '"' : ""
    })`;

    if (applicationName === undefined) {
      return errorLog(method, "Application name invalid");
    }

    const applicationPath = getApplicationPath(applicationName);

    if (!exists(applicationPath)) {
      return errorLog(method, "Application is not found");
    }

    if (!this.applications.hasOwnProperty(applicationName)) {
      return errorLog(method, "Application has not been opened");
    }

    this.applications[applicationName].close();
    delete this.applications[applicationName];

    return log(method, "Application has been closed");
  }
}

module.exports = Core;
