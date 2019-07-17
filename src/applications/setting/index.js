async function main(application) {
  application.post("/remove", (_, response) => {
    application.removeSharedAppData("authentication.json");
    response.status(200).end();
    process.exit(1);
  });

  const window = await application.createWindow()
  window.setMaximumSize(800, 600);
  window.setMinimumSize(800, 600);
}

module.exports = main;
