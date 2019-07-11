const fs = require("fs");
const exists = require("./exists");
const { isAbsolutePath } = require("../utility");

// Is node.js rmdir recursive ? Will it work on non empty directories?
// https://stackoverflow.com/questions/12627586/is-node-js-rmdir-recursive-will-it-work-on-non-empty-directories
const removeDirectory = path => {
  let files = [];

  if (exists(path) === true) {
    files = fs.readdirSync(path);

    files.forEach(file => {
      let filePath = path + "/" + file;

      if (fs.lstatSync(filePath).isDirectory()) {
        return removeDirectory(filePath);
      } else {
        fs.unlinkSync(filePath);
      }
    });

    fs.rmdirSync(path);
    return true;
  }

  return false;
};

module.exports = path => {
  if (!isAbsolutePath(path)) {
    return false;
  }

  return removeDirectory(path);
};
