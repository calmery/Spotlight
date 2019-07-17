const fs = require("fs");
const path = require("path");

// ファイルの存在を確認する
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

  // '/' または '\' でパスを分割する
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

// ファイルを読み込む．パスが絶対パスではない，またはファイルが存在しない場合は null を返す
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

// Is node.js rmdir recursive ? Will it work on non empty directories ?
// Reference: https://stackoverflow.com/questions/12627586/is-node-js-rmdir-recursive-will-it-work-on-non-empty-directories
function removeDirectoryHelper(directoryPath) {
  let files = [];

  if (exists(directoryPath)) {
    // 指定されたディレクトリ内に存在するファイルを取得する
    files = fs.readdirSync(directoryPath);

    for(let i=0; i<files.length; i++) {
      const fileName = files[i];
      const filePath = directoryPath + "/" + fileName;

      if (fs.lstatSync(filePath).isDirectory()) {
        // もしフォルダであれば再帰的にそのフォルダの中のファイルも削除する
        return removeDirectory(filePath);
      } else {
        fs.unlinkSync(filePath);
      }
    }

    fs.rmdirSync(directoryPath);
    return true;
  }

  return false;
}

// フォルダを削除する．ここではまず絶対パスかどうかを確認する
function removeDirectory(directoryPath) {
  if (!path.isAbsolute(directoryPath)) {
    return false;
  }

  return removeDirectoryHelper(directoryPath);
}

// ファイルを削除する
function removeFile(filePath) {
  if (!path.isAbsolute(filePath) || !exists(filePath)) {
    return false;
  }

  fs.unlinkSync(filePath);

  return true;
}

// ファイルを作成，書き込む
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

module.exports = {
  exists,
  makeDirectory,
  readFile,
  removeFile,
  removeDirectory,
  writeFile
};
