const express = require('express');
const router = express.Router();
const surveyController = require('../controllers/surveyController');
const { ensureAuth, ensureCoordinatorOrAdmin, ensureRespondent } = require('../middlewares/authMiddleware');


// POST para criar uma nova survey - apenas usuários autenticados
router.post('/', ensureAuth, ensureCoordinatorOrAdmin, surveyController.createSurvey);

router.get('/waiting', ensureAuth, ensureCoordinatorOrAdmin, surveyController.getWaitingSurveys);

router.get('/responded', ensureAuth, surveyController.getRespondedSurveys);

// GET para obter os resultados de uma survey
router.get('/results/:id', ensureAuth, surveyController.getSurveyResults);

// GET para listar todas as surveys
router.get('/', ensureAuth, surveyController.getAllSurveys);

// DELETE para deletar uma survey
router.delete('/:id', ensureAuth, ensureCoordinatorOrAdmin, surveyController.deleteSurvey);

// GET para obter todas as surveys abertas
router.get('/open', ensureAuth, surveyController.getOpenSurveys);

// GET para obter uma survey específica pelo ID
router.get('/:id', ensureAuth, surveyController.getSurveyById);

// Endpoint para abrir uma survey
router.put('/open/:id', ensureAuth, ensureCoordinatorOrAdmin, surveyController.openSurvey);

// Endpoint para fechar uma survey
router.put('/close/:id', ensureAuth, ensureCoordinatorOrAdmin, surveyController.closeSurvey);

// Endpoint para submeter resposta para uma survey
router.post('/response', ensureAuth, ensureRespondent, surveyController.submitResponse);

module.exports = router;