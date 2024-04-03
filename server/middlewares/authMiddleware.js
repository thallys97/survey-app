module.exports = {
    ensureAuth: function (req, res, next) {
      if (req.isAuthenticated()) { // Passport adiciona o método isAuthenticated() ao req
        return next();
      } else {
        res.status(401).json({ message: 'Usuário não autenticado' });
      }
    },
    ensureCoordinator: function (req, res, next) {
      if (req.user.role === 'SurveyCoordinator') {
        return next();
      } else {
        res.status(403).json({ message: 'Acesso negado' });
      }
    }
  };