function main(application) {
  if (application.loadSharedAppData("authentication.json") === null) {
    application.openApplication("oauth");
    application.close();
    return;
  }

  application.post("/open", (request, response) => {
    application.openApplication(request.body.name);
    response.status(200).end();
  });

  const window = application.createWindow({
    width: 200,
    height: 600
  });
  window.setMaximumSize(200, 600);
  window.setMinimumSize(200, 600);
}

module.exports = main;
