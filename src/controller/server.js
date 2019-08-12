const cors = require("cors");
const express = require("express");
const expressSession = require("express-session");
const passport = require("passport");
const path = require("path");
const TwitterStrategy = require("passport-twitter").Strategy;

// Constants

// Twitter 認証のために 60321 というポート番号を使用する
// `https://developer.twitter.com` の設定項目である Callback URL に `http://127.0.0.1:60321/callback` と指定している
const PORT = 60321;
const STATIC_PATH = path.resolve(__dirname, "../static");

// Passport (http://www.passportjs.org/)

passport.serializeUser(function(user, done) {
  return done(null, user);
});

passport.deserializeUser(function(user, done) {
  return done(null, user);
});

passport.use(
  new TwitterStrategy(
    {
      // `https://developer.twitter.com` で新規にアプリケーションを作成した場合はこのキーの値を更新する必要がある
      consumerKey: "nDnk9b8WsPVE5hLoY44qNSevM",
      consumerSecret: "hEesWDwCN6HTbkQ0YdIvgdHsgIhzEqcGwgKKtrerLbIz87BhS9",
      callbackURL: `http://127.0.0.1:${PORT}/callback`
    },
    function(accessToken, accessTokenSecret, user, done) {
      user.access_token = accessToken;
      user.access_token_secret = accessTokenSecret;
      user.authorized_at = new Date().toString();

      controller.saveAppData("authentication.json", JSON.stringify(user));

      // アプリケーションを再起動する
      controller.restart();

      return done(null, user);
    }
  )
);

// Express (https://expressjs.com/ja/)

const app = express();

// Reference: https://developer.mozilla.org/ja/docs/Web/HTTP/CORS
// Reference: https://www.npmjs.com/package/cors
app.use(cors());
app.use(express.static(STATIC_PATH));
app.use(passport.initialize());
app.use(passport.session());
app.use(
  expressSession({
    secret: "spotlight",
    resave: true,
    saveUninitialized: true,
    cookie: {
      secure: "auto"
    }
  })
);

app.get("/oauth", passport.authenticate("twitter"));
app.get(
  "/callback",
  passport.authenticate("twitter", {
    // 認証に失敗した場合は `oauth.html` に戻る
    failureRedirect: "oauth.html"
  })
);

app.listen(PORT);

function getUrl() {
  return `http://127.0.0.1:${PORT}`;
}

module.exports = {
  getUrl: getUrl
};
