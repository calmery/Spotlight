function openApplication(name) {
  controller.createWindow().loadURL(`${controller.getUrl()}/${name}.html`);
}
