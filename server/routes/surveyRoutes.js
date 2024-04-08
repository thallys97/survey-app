const express = require('express');
const router = express.Router();
const surveyController = require('../controllers/surveyController');
const { ensureAuth, ensureCoordinatorOrAdmin } = require('../middlewares/authMiddleware');


// POST para criar uma nova survey - apenas usuários autenticados
router.post('/', ensureAuth, ensureCoordinatorOrAdmin, surveyController.createSurvey);

router.get('/waiting', ensureAuth, surveyController.getWaitingSurveys);

// GET para listar todas as surveys
router.get('/', surveyController.getAllSurveys);

// DELETE para deletar uma survey
router.delete('/:id', ensureAuth, ensureCoordinatorOrAdmin, surveyController.deleteSurvey);

// GET para obter todas as surveys abertas
router.get('/open', surveyController.getOpenSurveys);

// GET para obter uma survey específica pelo ID
router.get('/:id', ensureAuth, surveyController.getSurveyById);

// Endpoint para abrir uma survey
router.put('/open/:id', ensureAuth, ensureCoordinatorOrAdmin, surveyController.openSurvey);

// Endpoint para fechar uma survey
router.put('/close/:id', ensureAuth, ensureCoordinatorOrAdmin, surveyController.closeSurvey);

// Endpoint para submeter resposta para uma survey
router.post('/response', ensureAuth, surveyController.submitResponse);

module.exports = router;