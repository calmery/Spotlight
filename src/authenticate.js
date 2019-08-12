const createServer = require("./controller/server").create;
const electron = require("electron");
const expressSession = require("express-session");
const passport = require("passport");
const TwitterStrategy = require("passport-twitter").Strategy;

passport.serializeUser(function(user, done) {
  return done(null, user);
});

passport.deserializeUser(function(user, done) {
  return done(null, user);
});

function authenticate() {
  const server = createServer(60321);

  server.use(passport.initialize());
  server.use(passport.session());
  server.use(
    expressSession({
      secret: "spotlight",
      resave: true,
      saveUninitialized: true,
      cookie: {
        secure: "auto"
      }
    })
  );

  passport.use(
    new TwitterStrategy(
      {
        consumerKey: "nDnk9b8WsPVE5hLoY44qNSevM",
        consumerSecret: "hEesWDwCN6HTbkQ0YdIvgdHsgIhzEqcGwgKKtrerLbIz87BhS9",
        callbackURL: "http://127.0.0.1:60321/callback"
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

  server.get("/oauth", passport.authenticate("twitter"));
  server.get(
    "/callback",
    passport.authenticate("twitter", {
      failureRedirect: `${controller.getUrl()}/oauth.html`
    })
  );

  controller.createWindow("oauth.html").openDevTools();
}

module.exports = authenticate;
