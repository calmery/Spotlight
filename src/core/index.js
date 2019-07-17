const { absolutePath, debug } = require("./helpers/utility");
const { exists } = require("./helpers/file");
const { wait } = require("./helpers/window");
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

  async openApplication(applicationName) {
    await wait();

    const method = `openApplication(${
      applicationName ? '"' + applicationName + '"' : ""
    })`;

    if (applicationName === undefined) {
      errorLog(method, "Application name invalid");
      return;
    }

    const applicationPath = getApplicationPath(applicationName);

    if (!exists(applicationPath)) {
      errorLog(method, "Application is not found");
      return;
    }

    if (this.applications[applicationName] !== undefined) {
      errorLog(method, "Application is already opened");
      return;
    }

    try {
      this.applications[applicationName] = new Application(this, {
        name: applicationName,
        currentDirectory: absolutePath(
          __dirname,
          `../applications/${applicationName}`
        )
      });

      const self = this;
      this.applications[applicationName].on("close", function() {
        delete self.applications[applicationName];
        // if (Object.keys(this.applications).length === 0) {
        //   process.exit(0);
        // }
      });

      log(method, "Application has been opened");

      require(applicationPath)(this.applications[applicationName]);
    } catch (_) {
      delete this.applications[applicationName];
      errorLog(method, "Application structure is incorrect");
    }
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
