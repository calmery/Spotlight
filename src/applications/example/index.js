function main(application) {
  // 1. ログの操作

  // 特定の文字列を出力したい場合，console.log を使うのも良いですが可読性のために application.log を使うことを推奨します
  application.log("Hello World !");

  /* -------------------- */

  // 2. サーバの操作

  // デフォルトでアプリケーションのフォルダ内にある static フォルダが配信されます
  // index.html を static フォルダ内に配置しておくことでウインドウを立ち上げたときに index.html の内容が最初に表示されます
  // また，src/static/ フォルダの内容も配信されます．これはアプリケーション間で使用する共通のファイル（画像など）を配信するためです
  // もし src/static/ フォルダとアプリケーション内の static フォルダ（ここでは src/applications/example/static/）に同じ名前のファイルが存在した場合はアプリケーションのファイルが優先されます

  // アプリケーションにはランダムなポートが割り当てられますが，必要であればポートを固定することもできます
  // これは Twitter 認証時のコールバック URL の指定などに有効な手段です
  application.setPort(3000);

  // 例
  //   src/static/common.css => /common.css
  //   src/applications/example/static/layout.css => /layout.css

  // それとは別途，特定のパスでデータを受け取りたいという場合は get や post を使用してルーティングを行います
  // これらのメソッドは内部的に express に渡されます
  // Reference: https://expressjs.com/ja/api.html#app.get
  application.get("/get-example", function(request, response) {
    // application.get では request.query で送られてきたデータを参照できます
    const query = request.query;
    application.log(query);
    response.send("Hello From Server ! (GET)");
  });

  application.post("/post-example", function(request, response) {
    // application.post では request.body で送られてきたデータを参照できます
    const body = request.body;
    application.log(body);
    response.send("Hello From Server ! (POST)");
  });

  application.get("/example", function(request, response) {
    // application.get では request.query で送られてきたデータを参照できます
    const query = request.query;
    response.json({
      z: parseInt(query.x, 10) + parseInt(query.y, 10)
    });
  });

  /* -------------------- */

  // 3. ウインドウの操作

  // application.createWindow の引数は BrowserWindow にそのまま渡されます．そのためオプションに関しては BrowserWindow のリファレンスを参照してください．
  // そして application.createWindow の戻り値として変数 window に代入されるのは BrowserWindow のインスタンスです
  // Reference: https://electronjs.org/docs/api/browser-window
  const window = application.createWindow({
    width: 400, // アプリケーションウインドウの横幅を指定します
    height: 300 // アプリケーションの縦幅を指定します
  });

  // 例として，window に対して setMinimumSize というメソッドを呼び出しています
  // ウインドウを生成したときと同じ横幅，縦幅を指定したためウインドウは現状のサイズより大きくすることはできますが小さくすることはできません
  // Reference: https://electronjs.org/docs/api/browser-window#winsetmaximizablemaximizable-macos-windows
  window.setMinimumSize(400, 300);
  // ウインドウに開発者ツールを表示します
  // クライアント側のログなどは開発者ツールに出力されます
  window.openDevTools();

  // 複数のウインドウを立ち上げることもできます
  // 引数を指定しない場合，横幅 800，縦幅 600 でウインドウが生成されます
  application.createWindow();

  // 外部の URL を指定して開くことも可能です
  const browser = application.createWindow();
  browser.loadURL("https://google.com");

  /* -------------------- */

  // 4. ファイルの操作

  // コンピュータにファイルを保存することができます
  // application.saveAppData(ファイル名, 内容（文字列）)
  // applocation.loadAppData(ファイル名)
  // application.saveDocuments(ファイル名, 内容（文字列）)
  // applocation.loadDocuments(ファイル名)

  // AppData に example.txt を保存し，その内容を読み込み出力します
  application.saveAppData("example.txt", "Hello World");
  const text = application.loadAppData("example.txt");
  application.log(text);

  // 次のメソッドを使うと他のアプリケーションとデータを共有できます
  // application.saveSharedAppData(ファイル名, 内容（文字列）)
  // applocation.loadSharedAppData(ファイル名)
  // application.saveSharedDocuments(ファイル名, 内容（文字列）)
  // applocation.loadSharedDocuments(ファイル名)

  // 動作は同じです
  // application.saveAppData などでは他のアプリケーションからデータを参照できませんが，このメソッドであれば参照できます
  // Spotlight であれば Twitter の検索データは search，edit で使用するため共有データとして保存されています
  application.saveSharedAppData("example.txt", "Hello World (Shared)");
  const sharedText = application.loadSharedAppData("example.txt");
  application.log(sharedText);

  /* -------------------- */

  // 5. イベント

  // アプリケーションではいくつかのイベントを受け取ることができます

  // このアプリケーション（ここでは example）が起動した際に，または起動リクエストが送られてきた際に発火します
  // ここでの起動リクエストとはアプリケーションは実行中であるが，外部から起動するように要求があった場合です
  // このイベントが役立つのは，例えばウインドウが全て閉じられた際に，他のアプリケーションから起動リクエストを送りこのイベントで捕捉してウインドウを新たに作成するなどです
  application.on("open", function() {
    application.log("Open !");
  });

  // このアプリケーション（ここでは example）が終了する際に発火します
  application.on("close", function() {
    application.log("Close !");
  });

  // このアプリケーション（ここでは example）に紐づいたウインドウがアクティブでなった場合に発火します
  application.on("focus", function() {
    application.log("Focus !");
  });

  // このアプリケーション（ここでは example）に紐づいた全てのウインドウがアクティブでない場合に発火します
  application.on("blur", function() {
    application.log("Blur !");
  });

  /* -------------------- */

  // 6. 応用例（相互通信の例）

  // src/applications/example/static フォルダにある example.html と example.js に対応しています
  // クライアント側から送られてきたデータをここで受け取り，クライアントに返しています

  application.post("/post-message", function(request, response) {
    // クライアントから送られてきたメッセージを受け取る
    const message = request.body.messageFromClient;

    application.log("Recieved: " + message);

    // 加工して送り返す
    response.json({
      messageFromServer: "Recieved: " + message
    });
  });

  const main = application.createWindow();
  // src/applications/example/static 内にある example.html を開きます
  main.loadURL(application.getUrl() + "/example.html");
  main.openDevTools();
}

// module.exports に代入した関数がアプリケーションの起動時に呼び出されます
module.exports = main;
