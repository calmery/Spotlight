const fs = require("fs");
const { isAbsolutePath } = require("../utility");

module.exports = path => {
  if (!isAbsolutePath(path)) {
    return null;
  }

  try {
    return fs.readFileSync(path, "utf-8");
  } catch (_) {
    return null;
  }
};
