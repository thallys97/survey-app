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
    res.redirect('/dashboard'); // Ou para onde você deseja direcionar o usuário
  }
);

router.get('/current_user', (req, res) => {
  if (req.isAuthenticated()) {
    res.send(req.user);
  } else {
    res.status(401).send({ user: null });
  }
});

router.get('/logout', (req, res) => {
  req.logout();  // Passport expõe este método para terminar uma sessão de login
  req.session.destroy();  // Destrói a sessão no servidor
  res.redirect('/');
});

// Exportar as rotas
module.exports = router;