const Survey = require('../models/Survey');

// Cria uma nova survey
exports.createSurvey = async (req, res) => {
  try {
    const { title, questions } = req.body;
    const survey = new Survey({ title, questions, createdBy: req.user._id });
    await survey.save();
    res.status(201).json(survey);
  } catch (error) {
    res.status(500).json({ message: 'Error creating survey', error: error.message });
  }
};

// Lista apenas as surveys que estão abertas
exports.getAllSurveys = async (req, res) => {
  try {
    const surveys = await Survey.find({ open: true });
    res.status(200).json(surveys);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching open surveys', error: error.message });
  }
};

// Obter uma survey específica pelo ID
exports.getSurveyById = async (req, res) => {
  try {
    const survey = await Survey.findById(req.params.id);
    if (!survey) {
      return res.status(404).json({ message: 'Survey not found' });
    }
    res.status(200).json(survey);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching survey', error: error.message });
  }
};

// Abrir uma survey
exports.openSurvey = async (req, res) => {
  try {
    const survey = await Survey.findByIdAndUpdate(req.params.id, { open: true }, { new: true });
    res.status(200).json(survey);
  } catch (error) {
    res.status(500).json({ message: 'Error opening survey', error: error.message });
  }
};

// Fechar uma survey
exports.closeSurvey = async (req, res) => {
  try {
    const survey = await Survey.findByIdAndUpdate(req.params.id, { open: false }, { new: true });
    res.status(200).json(survey);
  } catch (error) {
    res.status(500).json({ message: 'Error closing survey', error: error.message });
  }
};

// Submeter resposta para uma survey
exports.submitResponse = async (req, res) => {
  try {
    const { surveyId, responses } = req.body;
    const newResponse = new Response({
      survey: surveyId,
      responses: responses,
      respondent: req.user._id
    });
    await newResponse.save();
    res.status(201).json(newResponse);
  } catch (error) {
    res.status(500).json({ message: 'Error submitting response', error: error.message });
  }
};
