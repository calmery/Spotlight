function main(application) {
  application.post("/remove", (_, response) => {
    application.removeSharedAppData("authentication.json");
    response.status(200).end();
    process.exit(1);
  });

  application.on("open", () => {
    if (application.getWindowCount() === 0) {
      const window = application.createWindow({
        width: 800,
        height: 600
      });
      window.setMaximumSize(800, 600);
      window.setMinimumSize(800, 600);
    }
  })
}

module.exports = main;
