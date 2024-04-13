module.exports = {
    ensureAuth: function (req, res, next) {
      if (req.isAuthenticated()) { // Passport adiciona o método isAuthenticated() ao req
        return next();
      } else {
        res.status(401).json({ message: 'Usuário não autenticado' });
      }
    },

    ensureRespondent: function (req, res, next) {
      if (req.user.role === 'SurveyRespondent') {
        return next();
      } else {
        res.status(403).json({ message: 'Acesso negado' });
      }
    },

    ensureCoordinatorOrAdmin: function (req, res, next) {
      if (req.user.role === 'SurveyCoordinator' || req.user.role === 'SurveyAdmin') {
        return next();
      } else {
        res.status(403).json({ message: 'Acesso negado' });
      }
    },

    ensureAdmin: function (req, res, next) {
      if (req.user.role === 'SurveyAdmin') {
        return next();
      } else {
        res.status(403).json({ message: 'Acesso restrito apenas para administradores' });
      }
    }
  };

