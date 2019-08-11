const expressSession = require("express-session");
const passport = require("passport");
const TwitterStrategy = require("passport-twitter").Strategy;

passport.serializeUser(function(user, done) {
  return done(null, user);
});
passport.deserializeUser(function(user, done) {
  return done(null, user);
});

function oauth() {
  const x = application.openWindow();
  x.openDevTools();
  x.loadURL(`http://${window.location.host}/oauth`)
}

function main() {
  // Twitter Developers (https://developer.twitter.com/apps) で作成したアプリケーションではコールバック URL を指定する必要があるため
  // Reference: https://developer.twitter.com/en/docs/basics/apps/guides/callback-urls
  application._serverManager.use(passport.initialize());
  application._serverManager.use(passport.session());
  application._serverManager.use(
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
        callbackURL: `${application.getUrl()}/callback`
      },
      function(accessToken, accessTokenSecret, user, done) {
        user.access_token = accessToken;
        user.access_token_secret = accessTokenSecret;
        user.authorized_at = new Date().toString();
        application.saveAppData(
          "authentication.json",
          JSON.stringify(user)
        );
        // controller の起動を待機する必要がある
        const controller = application.openApplication("controller");
        controller.openWindow();
        application.close();
        return done(null, user);
      }
    )
  );

  application._serverManager.get("/oauth", passport.authenticate("twitter"));
  application._serverManager.get(
    "/callback",
    passport.authenticate("twitter", {
      failureRedirect: "/"
    })
  );
}

main();
