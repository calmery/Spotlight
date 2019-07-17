function sendMessage() {
  const message = document.getElementById("message").value;

  post("/post-message", {
    messageFromClient: message
  }).then(function(response) {
    alert(response.messageFromServer);
  });
}
