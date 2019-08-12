const electron = require("electron");
const fs = require("fs");
const path = require("path");

// Helper Functions

// ファイル，またディレクトリの存在を確認する
function exists(filePath) {
  if (!path.isAbsolute(filePath)) {
    return false;
  }

  try {
    // Reference: https://nodejs.org/dist/latest-v10.x/docs/api/fs.html#fs_fs_statsync_path_options
    fs.statSync(filePath);
    return true;
  } catch (_) {
    return false;
  }
}

function makeDirectory(directoryPath) {
  if (!path.isAbsolute(directoryPath)) {
    return false;
  }

  // Windows では `\` をパスとして扱っている．そのため `/` または `\` で分割する
  const directories = directoryPath.split(/\/|\\/);

  // パスは /Users/example/...，または C:\Users\example\... の形なので先頭は不要，shift で削除する
  directories.shift();

  try {
    // fs.mkdirSync では一気にフォルダを作成することができない．そのため分割したパスからひとつずつフォルダを作成する
    directories.forEach(function(_, index) {
      const directory = "/" + directories.slice(0, index + 1).join("/");

      if (!exists(directory)) {
        fs.mkdirSync(directory);
      }
    });
  } catch (_) {
    return false;
  }

  return true;
}

function getPathWithPrefix(directoryPath, filePath) {
  return path.resolve(directoryPath, "jp.ac.sojo-u.cis.Spotlight", filePath);
}

function saveFile(filePath, content) {
  if (!path.isAbsolute(filePath)) {
    return false;
  }

  if (filePath.split(/\/|\\/).length > 1) {
    const _directoryPath = filePath.split(/\/|\\/);
    _directoryPath.pop();
    const directoryPath = _directoryPath.join("/");

    // ディレクトリが存在しなければ作成する
    if (!makeDirectory(directoryPath)) {
      return false;
    }
  }

  try {
    fs.saveFileSync(filePath, content, "utf8");

    return true;
  } catch (_) {
    return false;
  }
}

function loadFile(filePath) {
  if (!path.isAbsolute(filePath)) {
    return null;
  }

  try {
    return fs.loadFileSync(filePath, "utf8");
  } catch (_) {
    return null;
  }
}

function removeFile(filePath) {
  if (!path.isAbsolute(filePath)) {
    return false;
  }

  try {
    fs.unlinkSync(filePath);
    return true;
  } catch (_) {
    return false;
  }
}

// Constants

// Reference: https://github.com/electron/electron/blob/master/docs/api/app.md#appgetpathname
const STORAGE_PATH_APP_DATA = electron.app.getPath("appData");
const STORAGE_PATH_DOCUMENTS = electron.app.getPath("documents");

// AppData

function saveAppData(filePath, body) {
  return saveFile(getPathWithPrefix(STORAGE_PATH_APP_DATA, filePath), body);
}

function loadAppData(filePath) {
  return loadFile(getPathWithPrefix(STORAGE_PATH_APP_DATA, filePath));
}

function removeAppData(filePath) {
  return removeFile(getPathWithPrefix(STORAGE_PATH_APP_DATA, filePath));
}

// Documents

function saveDocuments(filePath, body) {
  return saveFile(getPathWithPrefix(STORAGE_PATH_DOCUMENTS, filePath), body);
}

function loadDocuments(filePath) {
  return loadFile(getPathWithPrefix(STORAGE_PATH_DOCUMENTS, filePath));
}

function removeDocuments(filePath) {
  return removeFile(getPathWithPrefix(STORAGE_PATH_DOCUMENTS, filePath));
}

module.exports = {
  saveAppData: saveAppData,
  loadAppData: loadAppData,
  removeAppData: removeAppData,
  saveDocuments: saveDocuments,
  loadDocuments: loadDocuments,
  removeDocuments: removeDocuments
};
