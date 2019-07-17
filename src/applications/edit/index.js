const crypto = require("crypto");
const Twitter = require("twitter");

function md5(string) {
  const md5 = crypto.createHash("md5");
  return md5.update(JSON.stringify(string), "binary").digest("hex");
}

function main(application) {
  let searchJson = application.loadSharedDocuments("search.json");

  // 検索結果を保存したファイルのリストを search.json に保存するため存在しなければあらかじめ作成する
  if (searchJson === null) {
    application.saveSharedDocuments("search.json", JSON.stringify({}));
    searchJson = {};
  } else {
    searchJson = JSON.parse(searchJson);
  }

  // Routing

  // is_dangerous が更新されたデータを保存する
  application.post("/save", function(request, response) {
    const tweets = request.body;
    const name = md5(JSON.stringify(tweets.search_metadata));
    application.saveSharedDocuments(`${name}.json`, JSON.stringify(tweets));

    // search.json の内容を更新する
    const searchJson = JSON.parse(
      application.loadSharedDocuments("search.json")
    );
    searchJson[name] = tweets.search_metadata.query;
    application.saveSharedDocuments("search.json", JSON.stringify(searchJson));

    response.status(200).end();
  });

  application.get("/all", function(request, response) {
    response
      .status(200)
      .json(searchJson)
      .end();
  });

  application.get("/load", function(request, response) {
    const name = request.query.name;

    // ファイル名前が指定されていない場合は読み込みを行わない
    if (name === undefined) {
      // Reference: https://developer.mozilla.org/ja/docs/Web/HTTP/Status/400
      response.status(400).end();
      return;
    }

    // TODO: バリデーションしてない
    const tweets = application.loadSharedDocuments(`${name}.json`);

    // ファイルが見つからない
    if (tweets === null) {
      response.status(404).end();

      // search.json に含まれている場合，データにズレが発生しているので search.json を更新する
      if (searchJson.hasOwnProperty(name)) {
        delete searchJson[name];
        application.saveSharedDocuments(
          "search.json",
          JSON.stringify(searchJson)
        );
      }

      return;
    }

    response
      .status(200)
      .json(JSON.parse(tweets))
      .end();
  });

  application.on("open", () => {
    if (application.getWindowCount() === 0) {
      const window = application.createWindow({
        width: 800,
        height: 600
      });
      window.setMaximumSize(800, 600);
      window.setMinimumSize(800, 600);
    }
  })
}

module.exports = main;
