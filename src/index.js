require("./controller");
const authenticate = require("./authenticate");

controller.ready(function() {
  // Twitter の認証情報を格納した `authentication.json` が存在すれば通常の処理を，存在しなければ Twitter 認証を行う
  if (controller.loadAppData("authentication.json") !== null) {
    // Reference: https://electronjs.org/docs/api/browser-window#new-browserwindowoptions
    controller.createWindow("controller.html", {
      width: 200,
      height: 600,
      // 最小，最大のウインドウサイズを設定する
      // ここでは同じ値を使用することでサイズの変更ができないようにしている
      minWidth: 200,
      minHeight: 600,
      maxWidth: 200,
      maxHeight: 600
    });
  } else {
    authenticate();
  }
});
