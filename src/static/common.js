function get(url, parameters) {
  const u = new URL(`${window.location.origin}${url}`);
  const p = new URLSearchParams();

  if (parameters !== undefined) {
    Object.entries(parameters).map(([key, value]) => p.append(key, value));
  }

  u.search = p.toString();
  return fetch(u.toString()).then(function(response) {
    return response.json();
  });
}

function post(url, parameters) {
  return fetch(url, {
    method: "POST",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    },
    body: JSON.stringify(parameters)
  }).then(function(response) {
    return response.json();
  });
}
