function main(application) {
  application.post("/remove", function(_, response) {
    application.removeSharedAppData("authentication.json");

    // 検索データを削除する
    let searchJson = application.loadSharedDocuments("search.json");
    if (searchJson !== null) {
      searchJson = JSON.parse(searchJson);
      const fileNames = Object.keys(searchJson);
      for (let i = 0; i < fileNames.length; i++) {
        application.removeSharedDocuments(fileNames[i] + ".json");
      }
      application.removeSharedDocuments("search.json");
    }

    response.status(200).end();
    process.exit(0);
  });

  application.createFixedSizeWindow({
    width: 800,
    height: 600
  });
}

module.exports = main;
