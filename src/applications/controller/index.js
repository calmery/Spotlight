async function main(application) {
  application.post("/open", (request, response) => {
    console.log(request.body);
    response.send("OK");
  });

  const window = await application.createWindow({
    width: 200,
    height: 600
  });
  window.setMaximumSize(200, 600);
  window.setMinimumSize(200, 600);
}

module.exports = main;
