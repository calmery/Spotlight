function removeAllData() {
  if (confirm("認証情報，検索データを削除してアプリケーションを終了します")) {
    controller.removeAppData("authentication.json");

    // 検索データを全て削除する
    let searchJson = controller.loadDocuments("search.json");

    if (searchJson !== null) {
      searchJson = JSON.parse(searchJson);
      const fileNames = Object.keys(searchJson);

      for (let i = 0; i < fileNames.length; i++) {
        controller.removeDocuments(fileNames[i] + ".json");
      }

      controller.removeDocuments("search.json");
    }

    // アプリケーションを再起動する
    controller.restart();
  }
}
