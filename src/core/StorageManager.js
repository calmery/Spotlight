const electron = require("electron");
const fs = require("fs");
const path = require("path");

// Helper Functions

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

  // Windows が `\` をパスとして扱っている．`/' または '\' でパスを分割する
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

function readFile(filePath) {
  if (!path.isAbsolute(filePath)) {
    return null;
  }

  try {
    return fs.readFileSync(filePath, "utf8");
  } catch (_) {
    return null;
  }
}

function removeFile(filePath) {
  if (!path.isAbsolute(filePath) || !exists(filePath)) {
    return false;
  }

  fs.unlinkSync(filePath);

  return true;
}

function writeFile(filePath, content) {
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
    fs.writeFileSync(filePath, content, "utf8");

    return true;
  } catch (_) {
    return false;
  }
}

// Constants

// Reference: https://github.com/electron/electron/blob/master/docs/api/app.md#appgetpathname
const STORAGE_PREFIX = "jp.ac.sojo-u.cis.Spotlight";
const STORAGE_PATH_APP_DATA = electron.app.getPath("appData");
const STORAGE_PATH_DOCUMENTS = electron.app.getPath("documents");

// Storage Manager

class StorageManager {
  _getPath(directoryPath, filePath) {
    return path.resolve(directoryPath, STORAGE_PREFIX, filePath);
  }

  _save(directoryPath, filePath, body) {
    return writeFile(this._getPath(directoryPath, filePath), body);
  }

  _load(directoryPath, filePath) {
    return readFile(this._getPath(directoryPath, filePath));
  }

  _remove(directoryPath, filePath) {
    return removeFile(this._getPath(directoryPath, filePath));
  }

  // AppData

  saveAppData(filePath, body) {
    return this._save(STORAGE_PATH_APP_DATA, filePath, body);
  }

  loadAppData(filePath) {
    return this._load(STORAGE_PATH_APP_DATA, filePath);
  }

  removeAppData(filePath) {
    return this._remove(STORAGE_PATH_APP_DATA, filePath);
  }

  // Documents

  saveDocuments(filePath, body) {
    return this._save(STORAGE_PATH_DOCUMENTS, filePath, body);
  }

  loadDocuments(filePath) {
    return this._load(STORAGE_PATH_DOCUMENTS, filePath);
  }

  removeDocuments(filePath) {
    return this._remove(STORAGE_PATH_DOCUMENTS, filePath);
  }
}

module.exports = StorageManager;
