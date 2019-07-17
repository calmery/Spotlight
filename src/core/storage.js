const electron = require("electron");
const {
  file: { read, write, remove },
  utility: { absolutePath }
} = require("./helpers");

// Constants
// Reference: https://github.com/electron/electron/blob/master/docs/api/app.md#appgetpathname

const STORAGE_PREFIX = "jp.ac.sojo-u.cis.Spotlight";
const STORAGE_PATH_APP_DATA = electron.app.getPath("appData");
const STORAGE_PATH_DOCUMENTS = electron.app.getPath("documents");

// Main

class Storage {
  constructor(prefix) {
    this.prefix = prefix;
  }

  _getPath(directoryPath, filePath) {
    return absolutePath(
      directoryPath,
      STORAGE_PREFIX,
      this.prefix || "",
      filePath
    );
  }

  _save(directoryPath, filePath, body) {
    return write(this._getPath(directoryPath, filePath), body);
  }

  _load(directoryPath, filePath) {
    return read(this._getPath(directoryPath, filePath));
  }

  _remove(directoryPath, filePath) {
    return remove(this._getPath(directoryPath, filePath));
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

module.exports = Storage;
