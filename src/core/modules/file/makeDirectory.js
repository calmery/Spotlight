const fs = require("fs");
const exists = require("./exists");
const { isAbsolutePath } = require("../utility");

module.exports = path => {
  if (isAbsolutePath(path) === false) {
    return false;
  }

  let directories = path.split(/\/|\\/);
  directories.shift();

  try {
    directories.forEach((_, index) => {
      let directory = "/" + directories.slice(0, index + 1).join("/");
      if (exists(directory) === false) {
        fs.mkdirSync(directory);
      }
    });
  } catch (_) {
    return false;
  }

  return true;
};
