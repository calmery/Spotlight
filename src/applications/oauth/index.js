const expressSession = require("express-session");
const passport = require("passport");
const TwitterStrategy = require("passport-twitter").Strategy;

passport.serializeUser(function(user, done) {
  return done(null, user);
});
passport.deserializeUser(function(user, done) {
  return done(null, user);
});

function main(application) {
  // Twitter Developers (https://developer.twitter.com/apps) で作成したアプリケーションではコールバック URL を指定する必要があるため
  // Reference: https://developer.twitter.com/en/docs/basics/apps/guides/callback-urls
  application.setPort(60321);
  application.use(passport.initialize());
  application.use(passport.session());
  application.use(
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
        application.saveSharedAppData(
          "authentication.json",
          JSON.stringify(user)
        );
        application.log("Authorized");
        // controller の起動を待機する必要がある
        application.openApplication("controller");
        application.exit();
        return done(null, user);
      }
    )
  );

  application.get("/oauth", passport.authenticate("twitter"));
  application.get(
    "/callback",
    passport.authenticate("twitter", {
      failureRedirect: "/"
    })
  );

  application.createFixedSizeWindow({
    width: 800,
    height: 600
  });
}

module.exports = main;
