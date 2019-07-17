function removeAccount() {
  if(confirm("認証情報，検索データを削除してアプリケーションを終了します")) {
    postJson("/remove");
  }
}

function postJson(url, json) {
  return fetch(url, {
    method: "POST",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    },
    body: JSON.stringify(json)
  });
}
