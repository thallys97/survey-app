const express = require('express');
const router = express.Router();
const surveyController = require('../controllers/surveyController');
const { ensureAuth, ensureCoordinator } = require('../middlewares/authMiddleware');


// POST para criar uma nova survey - apenas usuários autenticados
router.post('/', ensureAuth, ensureCoordinator, surveyController.createSurvey);

// GET para listar todas as surveys
router.get('/', surveyController.getAllSurveys);

// Endpoint para abrir uma survey
router.put('/open/:id', ensureAuth, ensureCoordinator, surveyController.openSurvey);

// Endpoint para fechar uma survey
router.put('/close/:id', ensureAuth, ensureCoordinator, surveyController.closeSurvey);

// Endpoint para submeter resposta para uma survey
router.post('/response', ensureAuth, surveyController.submitResponse);

module.exports = router;