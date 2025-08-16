const router = require("express").Router();
const passport = require("passport");
const jwt = require('jsonwebtoken')

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
    prompt: 'consent'  // fuerza a mostrar el consentimiento cada vez
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/", session: false }),
  function (req, res) {
    console.log("Usuario recibido:", req.user);
    const userData = req.user;

    const payload = {
      email: userData.email,
    };

    const oneHour = 60 * 60 * 1000;

    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: oneHour / 1000,
    });

    res.cookie("jwt", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      maxAge: oneHour,
      sameSite: "strict",
    });
    
    res.send(`
      <html>
        <body>
          <script>
            window.location.href = "/";
          </script>
        </body>
      </html>
    `);
  }
);

module.exports = router;
