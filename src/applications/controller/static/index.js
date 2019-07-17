async function openApplication(name) {
  try {
    postJson("/open", { name });
  } catch (_) {
    alert("起動に失敗しました");
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
