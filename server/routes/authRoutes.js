const express = require('express');
const passport = require('passport');
const router = express.Router();

// Rota para autenticar com Google
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Callback da rota após autenticação
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/dashboard'); // Ou para onde você deseja direcionar o usuário
  }
);

// Exportar as rotas
module.exports = router;