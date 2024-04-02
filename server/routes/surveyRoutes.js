const express = require('express');
const router = express.Router();
const surveyController = require('../controllers/surveyController');

// POST para criar uma nova survey
router.post('/', surveyController.createSurvey);

// GET para listar todas as surveys
router.get('/', surveyController.getAllSurveys);

// Aqui você vai adicionar mais rotas conforme necessário

module.exports = router;