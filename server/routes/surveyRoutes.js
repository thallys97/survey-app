const express = require('express');
const router = express.Router();
const surveyController = require('../controllers/surveyController');
const { ensureAuth } = require('../middlewares/authMiddleware');

// POST para criar uma nova survey - apenas usuários autenticados
router.post('/', ensureAuth, surveyController.createSurvey);

// GET para listar todas as surveys
router.get('/', surveyController.getAllSurveys);

// Aqui você vai adicionar mais rotas conforme necessário

module.exports = router;