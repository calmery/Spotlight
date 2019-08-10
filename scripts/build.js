const fs = require("fs");
const path = require("path");
const electronBuilder = require("electron-builder");

// Build

const build = electronBuilder.build;
const Platform = electronBuilder.Platform;

// NOTE: https://www.electron.build/configuration/win
function buildForWindows() {
  return build({
    targets: Platform.WINDOWS.createTarget("nsis", electronBuilder.Arch.ia32),
    config: {
      productName: "Spotlight",
      // NOTE: GitHub Releases に登録しないようにする
      publish: null,
      directories: {
        app: path.resolve(__dirname, ".."),
        output: path.resolve(__dirname, "../build/windows")
      },
      icon: path.resolve(__dirname, "../src/static/icon.icns")
    }
  });
}

// NOTE: https://www.electron.build/configuration/mac
function buildForMacOS() {
  return build({
    targets: Platform.MAC.createTarget(),
    config: {
      productName: "Spotlight",
      // NOTE: GitHub Releases に登録しないようにする
      publish: null,
      directories: {
        app: path.resolve(__dirname, ".."),
        output: path.resolve(__dirname, "../build/osx")
      },
      // NOTE: http://www.img2icnsapp.com/
      icon: path.resolve(__dirname, "../src/static/icon.icns")
    }
  });
}

// Main

async function main() {
  try {
    await buildForWindows();
    console.log("Build Successful: Windows");
  } catch (error) {
    console.log(error.message || error.code || error);
  }

  try {
    await buildForMacOS();
    console.log("Build Successful: Mac OS");
  } catch (error) {
    console.log(error.message || error.code || error);
  }
}

main();
