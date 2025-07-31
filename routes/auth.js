const router = require("express").Router();
const passport = require("passport");

router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email'],
  session: false
}));


router.get('/google/callback', 
  passport.authenticate('google', { session: false }),
  function(req, res) {
    console.log('Usuario autenticado:', req.user);
    res.send('Autenticación completa');
});

module.exports = router