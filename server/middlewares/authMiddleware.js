const jwt = require('jsonwebtoken');


const verifyToken = (req, res) => {
  let token = req.headers.authorization;

  if (token && token.startsWith('Bearer ')) {
    // Retira 'Bearer ' do início
    token = token.slice(7, token.length);
  } else {
    // Se não houver token, retorna um erro
    return { error: 'Token não fornecido' };
  }

  try {
    // Tenta verificar o token e decodifica
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return { decoded };
  } catch (error) {
    // Se o token for inválido ou expirado, retorna um erro
    return { error: 'Token inválido' };
  }
};

const ensureAuth = function (req, res, next) {
  const { decoded, error } = verifyToken(req, res);
  if (error) {
    return res.status(401).json({ message: error });
  }

  req.user = decoded;
  next();
};

const ensureRespondent = function (req, res, next) {
  const { decoded, error } = verifyToken(req, res);
  if (error) {
    return res.status(401).json({ message: error });
  }

  if (decoded.role === 'SurveyRespondent') {
    req.user = decoded;
    next();
  } else {
    return res.status(403).json({ message: 'Acesso negado' });
  }
};

const ensureCoordinatorOrAdmin = function (req, res, next) {
  const { decoded, error } = verifyToken(req, res);
  if (error) {
    return res.status(401).json({ message: error });
  }

  if (decoded.role === 'SurveyCoordinator' || decoded.role === 'SurveyAdmin') {
    req.user = decoded;
    next();
  } else {
    return res.status(403).json({ message: 'Acesso negado' });
  }
};

const ensureAdmin = function (req, res, next) {
  const { decoded, error } = verifyToken(req, res);
  if (error) {
    return res.status(401).json({ message: error });
  }

  if (decoded.role === 'SurveyAdmin') {
    req.user = decoded;
    next();
  } else {
    return res.status(403).json({ message: 'Acesso restrito apenas para administradores' });
  }
};

module.exports = { ensureAuth, ensureRespondent, ensureCoordinatorOrAdmin, ensureAdmin };

