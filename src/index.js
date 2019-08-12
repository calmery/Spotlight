require("./controller");

controller.waitUntilReady(function() {
  controller.createWindow("controller.html").openDevTools();
});
