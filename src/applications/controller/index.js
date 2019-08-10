function main(application) {
  if (application.loadSharedAppData("authentication.json") === null) {
    application.openApplication("oauth");
    application.exit();
    return;
  }

  application.post("/open", function(request, response) {
    application.openApplication(request.body.name);
    response.status(200).end();
  });

  application.createFixedSizeWindow({
    width: 200,
    height: 600
  });
}

module.exports = main;
