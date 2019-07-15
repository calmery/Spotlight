const fs = require("fs");
const { isAbsolutePath } = require("../utility");

module.exports = (path, content) => {
  if (!isAbsolutePath(path)) {
    return false;
  }

  try {
    fs.writeFileSync(path, content, "utf8");

    return true;
  } catch (error) {
    return false;
  }
};
