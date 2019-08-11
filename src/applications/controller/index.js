if (application.loadAppData("authentication.json") === null) {
  const oauth = application.openApplication("oauth", 60321);
  oauth.openWindow().openDevTools();
  application.close();
}

function openApplication(name) {
  application.openApplication(name);
}
