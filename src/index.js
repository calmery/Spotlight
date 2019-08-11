require("./controller");

controller.waitUntilReady(function() {
  controller.createWindow().openDevTools();
});
