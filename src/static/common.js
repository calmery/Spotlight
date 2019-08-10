function get(url, parameters) {
  const u = new URL(`${window.location.origin}${url}`);
  const p = new URLSearchParams();

  if (parameters !== undefined) {
    Object.entries(parameters).map(function(parameter) {
      const key = parameter[0];
      const value = parameter[1];
      p.append(key, value);
    });
  }

  u.search = p.toString();
  return fetch(u.toString());
}

function post(url, parameters) {
  return fetch(url, {
    method: "POST",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    },
    body: JSON.stringify(parameters)
  });
}
