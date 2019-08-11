let data = null;

function renew() {
  if (data !== null && !confirm("保存されていないデータは失われます")) {
    return;
  }

  document.getElementById("output").innerHTML = "";
  document.getElementById("query").value = "";
  document.getElementById("search_field").style.display = "block";
  data = null;
}

function save() {
  if (data === null) {
    alert("検索データが存在しません");
    return;
  }

  post("/save", data).then(function(response) {
    if (response.status !== 200) {
      alert("保存に失敗しました");
      return;
    }

    alert("保存しました");
  });
}

function search() {
  const query = document.getElementById("query").value;

  if (query === "") {
    alert("キーワードを入力してください");
    return;
  }

  get("/search", { query })
    .catch(function() {
      alert("検索に失敗しました");
    })
    .then(function(response) {
      return response.json();
    })
    .then(function(tweets) {
      document.getElementById("search_field").style.display = "none";
      data = tweets;
      render(tweets);
    });
}

function toggle(id) {
  const element = document.getElementById(`t-${id}`);
  const index = parseInt(element.getAttribute("data-index"), 10);

  if (element.getAttribute("data-is-dangerous") === "true") {
    element.className = "_content _tweet _safe";
    element.setAttribute("data-is-dangerous", "false");
    data.statuses[index].is_dangerous = false;
  } else {
    element.className = "_content _tweet";
    element.setAttribute("data-is-dangerous", "true");
    data.statuses[index].is_dangerous = true;
  }
}
