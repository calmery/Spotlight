const fs = require("fs");
const { isAbsolutePath } = require("../utility");
const makeDirectory = require("./makeDirectory");

module.exports = (path, content) => {
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
};
