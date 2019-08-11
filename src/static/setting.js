function removeAccount() {
  if (confirm("認証情報，検索データを削除してアプリケーションを終了します")) {
    application.removeAppData("authentication.json");

    // 検索データを削除する
    let searchJson = application.loadDocuments("search.json");

    if (searchJson !== null) {
      searchJson = JSON.parse(searchJson);
      const fileNames = Object.keys(searchJson);
      for (let i = 0; i < fileNames.length; i++) {
        application.removeDocuments(fileNames[i] + ".json");
      }
      application.removeDocuments("search.json");
    }

    require("electron").remote.app.relaunch();
    require("electron").remote.app.exit(0);
  }
}
