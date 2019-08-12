require("./controller");

controller.ready(function() {
  // Twitter の認証情報が保存されている `authentication.json` が存在すれば通常の処理を，存在しなければ Twitter 認証を行う
  if (controller.loadAppData("authentication.json") !== null) {
    const width = 200;
    const height = 600;

    // Reference: https://electronjs.org/docs/api/browser-window#new-browserwindowoptions
    const window = controller.createWindow("controller.html", {
      width: width,
      height: height
    });

    // 最小，最大のウインドウサイズを設定する．ここでは同じ値を使用することでサイズの変更ができないようにしている
    // Reference: https://electronjs.org/docs/api/browser-window#winsetminimumsizewidth-height
    // Reference: https://electronjs.org/docs/api/browser-window#winsetmaximumsizewidth-height
    window.setMinimumSize(width, height);
    window.setMaximumSize(width, height);
  } else {
    controller.createWindow("oauth.html");
  }
});
