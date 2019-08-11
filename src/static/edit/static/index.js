let data = null;

function load(name) {
  if (data !== null && !confirm("保存されていないデータは失われます")) {
    return;
  }

  const menus = document.querySelectorAll(".file");

  for (let i = 0; i < menus.length; i++) {
    menus[i].className = "_menu file";
  }

  document.getElementById("output").innerHTML = "";
  data = null;

  get("/load", { name })
    .catch(function() {
      alert("データの読み込みに失敗しました");
    })
    .then(function(response) {
      return response.json();
    })
    .then(function(tweets) {
      data = tweets;
      document.getElementById(`f-${name}`).className = "_menu file _active";
      render(tweets);
    });
}

function renderFiles(files) {
  const element = document.getElementById("files");

  element.innerHTML = "";

  Object.entries(files).forEach(function(data) {
    const fileName = data[0] + ".json";
    const query = decodeURIComponent(data[1]);

    element.innerHTML += `
      <nav class="_navigator">
        <div class="_menu file" id="f-${data[0]}" onclick="load('${data[0]}')">
          <div class="_text">
            ${query}
            <div class="_description">${fileName}</div>
          </div>
        </div>
      </nav>
    `;
  });
}

function updateFiles() {
  get("/all")
    .catch(function() {
      alert("ファイル一覧の取得に失敗しました");
    })
    .then(function(response) {
      return response.json();
    })
    .then(renderFiles);
}

updateFiles();

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
