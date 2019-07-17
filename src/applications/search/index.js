const crypto = require("crypto");
const Twitter = require("twitter");

function md5(string) {
  const md5 = crypto.createHash("md5");
  return md5.update(JSON.stringify(string), "binary").digest("hex");
}

function main(application) {
  // 検索結果を保存したファイルのリストを search.json に保存するため存在しなければあらかじめ作成する
  if (application.loadSharedDocuments("search.json") === null) {
    application.saveSharedDocuments("search.json", JSON.stringify({}));
  }

  // Twitter の API を使用するために必要な Access Token と Access Token Secret を参照するため認証情報（authentication.json）を読み込む
  const authenticationJson = JSON.parse(
    application.loadSharedAppData("authentication.json")
  );

  const twitter = new Twitter({
    consumer_key: "nDnk9b8WsPVE5hLoY44qNSevM",
    consumer_secret: "hEesWDwCN6HTbkQ0YdIvgdHsgIhzEqcGwgKKtrerLbIz87BhS9",
    access_token_key: authenticationJson.access_token,
    access_token_secret: authenticationJson.access_token_secret
  });

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

  application.get("/search", function(request, response) {
    const query = request.query.query;

    // 検索ワードが指定されていない場合は検索を行わない
    if (query === undefined) {
      // Reference: https://developer.mozilla.org/ja/docs/Web/HTTP/Status/400
      response.status(400).end();
      return;
    }

    twitter.get(
      "search/tweets",
      {
        q: query,
        count: 100 // 検索するツイートの最大個数を 100 に固定する
      },
      function(error, tweets) {
        if (error !== null) {
          // Reference: https://developer.mozilla.org/ja/docs/Web/HTTP/Status/500
          response.status(500).end();
          return;
        }

        // 検索してすぐは全てのツイートに危険フラグをつける
        tweets.statuses = tweets.statuses.map(function(status) {
          status.is_dangerous = true;
          return status;
        });

        // Reference: https://developer.mozilla.org/ja/docs/Web/HTTP/Status/200
        response
          .status(200)
          .json(tweets)
          .end();
      }
    );
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
  });
}

module.exports = main;
