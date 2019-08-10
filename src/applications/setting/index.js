function main(application) {
  application.post("/remove", (_, response) => {
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

  const window = application.createWindow({
    width: 800,
    height: 600
  });
  window.setMaximumSize(800, 600);
  window.setMinimumSize(800, 600);
}

module.exports = main;
