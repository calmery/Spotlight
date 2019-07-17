get("/get-example", {
  message: "Hello From Client ! (GET)"
});

post("/post-example", {
  message: "Hello From Client ! (POST)"
});

// x と y の値をサーバに送信しサーバがわで足し合わせてクライアント側で表示する
get("/example", {
  x: 10,
  y: 20
}).then(function(result) {
  console.log(result.z);
});
