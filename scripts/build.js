"use strict";

const fs = require("fs");
const path = require("path")
const electronBuilder = require("electron-builder")

// Build

// NOTE: https://www.electron.build/configuration/win
const buildForWindows = async () => {
  const { build, Platform } = electronBuilder;

  await build({
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
};

// NOTE: https://www.electron.build/configuration/mac
const buildForMacOS = async () => {
  const { build, Platform } = electronBuilder;

  await build({
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
};

// Main

(async () => {
  try {
    await buildForWindows();
    console.log("Build Successful: Windows");
  } catch (error) {
    console.log(error.message || error.code || error);
  }

  console.log();

  try {
    await buildForMacOS();
    console.log("Build Successful: Mac OS");
  } catch (error) {
    console.log(error.message || error.code || error);
  }
})();
