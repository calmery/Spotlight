const fs = require("fs");
const { isAbsolutePath } = require("./utility");

function exists(path) {
  if (!isAbsolutePath(path)) {
    return false;
  }

  try {
    fs.statSync(path);
    return true;
  } catch (_) {
    return false;
  }
}

function makeDirectory(path) {
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
}

function read(path) {
  if (!isAbsolutePath(path)) {
    return null;
  }

  try {
    return fs.readFileSync(path, "utf8");
  } catch (_) {
    return null;
  }
}

// Is node.js rmdir recursive ? Will it work on non empty directories?
// https://stackoverflow.com/questions/12627586/is-node-js-rmdir-recursive-will-it-work-on-non-empty-directories
function removeDirectoryHelper(path) {
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
}

function removeDirectory(path) {
  if (!isAbsolutePath(path)) {
    return false;
  }

  return removeDirectoryHelper(path);
}

function remove(path) {
  if (!isAbsolutePath(path) || !exists(path)) {
    return false;
  }

  fs.unlinkSync(path);

  return true;
}

function write(path, content) {
  if (!isAbsolutePath(path)) {
    return false;
  }

  if (path.split(/\/|\\/).length > 1) {
    const _directoryPath = path.split(/\/|\\/);
    _directoryPath.pop();
    const directoryPath = _directoryPath.join("/");

    if (!makeDirectory(directoryPath)) {
      return false;
    }
  }

  try {
    fs.writeFileSync(path, content, "utf8");

    return true;
  } catch (error) {
    return false;
  }
}

module.exports = {
  exists,
  makeDirectory,
  read,
  remove,
  removeDirectory,
  write
};
