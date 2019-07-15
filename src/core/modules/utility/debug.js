const colors = require("colors/safe");

module.exports = (type, name, message) => {
  const date = new Date();
  const time = `${date.getFullYear()}/${date.getMonth()}/${date.getDay()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

  if (colors.hasOwnProperty(type)) {
    console.log(colors[type](time, name, "-", message));
    return;
  }

  console.log(time, name, "-", message);
};
