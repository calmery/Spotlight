const fs = require("fs");
const { isAbsolutePath } = require("../utility");

module.exports = path => {
  if (!isAbsolutePath(path)) {
    return false;
  }

  try {
    fs.statSync(path);
    return true;
  } catch (_) {
    return false;
  }
};
