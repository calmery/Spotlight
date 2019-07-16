const expressSession = require("express-session");
const passport = require("passport");
const TwitterStrategy = require("passport-twitter").Strategy;

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

async function main(application) {
  if (application.loadSharedAppData("authentication.json") !== null) {
    // electron を使用してひとつもウインドウが作られることなくアプリケーションを終了しようとした場合は electron が起動したままになる
    // 要は window-all-closed が呼ばれないのでアプリケーション自体が終了しない
    application.close();
    return;
  }

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
        application.close();
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

  const window = await application.createWindow();
  window.setMaximumSize(800, 600);
  window.setMinimumSize(800, 600);
  window.loadURL(application.getUrl());
}

module.exports = main;
