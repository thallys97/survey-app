const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const { ensureAuth } = require('../middlewares/authMiddleware');
const router = express.Router();

// Rota para autenticar com Google
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Callback da rota após autenticação
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login', session: false }),
  (req, res) => {
    // Usuário autenticado, agora gera um token JWT
    const payload = {
      id: req.user.id,
      displayName: req.user.displayName,
      email: req.user.email
    };
    
    // Assina o token JWT com o secret e expira em 1 dia
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1d' },
      (err, token) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: 'Erro ao gerar token JWT' });
        }
        console.log(token);
        console.log(`${process.env.CLIENT_URL}/dashboard?token=${token}`)
        // Redireciona para o cliente com o token
        res.redirect(`${process.env.CLIENT_URL}/dashboard?token=${token}`);
      }
    );
  }
);

// Rota para validar token JWT
router.get('/validate_token', ensureAuth, (req, res) => {
  // Se o token for válido, o middleware 'ensureAuth' adicionará o usuário ao 'req'
  if (req.user) {
    res.json({
      success: true,
      user: req.user
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Token inválido ou expirado'
    });
  }
});


router.get('/current_user', ensureAuth, (req, res) => {
  res.json(req.user);
});


// router.get('/current_user', (req, res) => {
//   const { decoded, error } = verifyToken(req, res);
//   if (error) {
//       return res.status(401).json({ message: 'Unauthorized: No token provided or token is invalid' });
//   }
//   // Optionally, verify the user still exists in the database here
//   res.json({
//       id: decoded.id,
//       displayName: decoded.displayName,
//       email: decoded.email,
//       role: decoded.role
//   });
// });

// router.get('/logout', (req, res) => {
//   req.logout((error) => {
//     if (error) { 
//       return next(error);
//     }
//     req.session.destroy(() => {
//       res.clearCookie('connect.sid'); // The name of the cookie may be different based on your configuration
//       res.redirect(process.env.CLIENT_URL);
//     });
//   });
// });

// Exportar as rotas
module.exports = router;