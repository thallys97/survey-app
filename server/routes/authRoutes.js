const express = require('express');
const passport = require('passport');
const router = express.Router();

// Rota para autenticar com Google
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Callback da rota após autenticação
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // Aqui você pode configurar o que será armazenado na sessão do usuário
    req.session.user = req.user;
    console.log(req.user);
    console.log(req.session);
    console.log(req.sessionID);
    console.log(req.isAuthenticated());
    console.log(req.session.cookie);
    
    res.redirect(process.env.CLIENT_URL + '/dashboard', ); // Ou para onde você deseja direcionar o usuário
  }
);

router.get('/current_user', (req, res) => {

  console.log(req.user);
  console.log(req.session);
  console.log(req.sessionID);
  console.log(req.isAuthenticated());
  console.log(req.session.cookie);

  if (req.isAuthenticated()) {
    res.send(req.user);
  } else {
    res.status(401).send({ user: null });
  }
});

router.get('/logout', (req, res) => {
  req.logout((error) => {
    if (error) { 
      return next(error);
    }
    req.session.destroy(() => {
      res.clearCookie('connect.sid'); // The name of the cookie may be different based on your configuration
      res.redirect(process.env.CLIENT_URL);
    });
  });
});

// Exportar as rotas
module.exports = router;