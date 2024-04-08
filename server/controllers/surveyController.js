const Survey = require('../models/Survey');
const Response = require('../models/Response');

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

exports.getWaitingSurveys = async (req, res) => {
  try {
    const surveys = await Survey.find({ open: false }).lean();
    const waitingSurveys = [];

    for (let survey of surveys) {
      const responses = await Response.find({ survey: survey._id });
      if (responses.length === 0) {
        waitingSurveys.push(survey);
      }
    }

    res.json(waitingSurveys);
  } catch (error) {
    console.error("Error fetching waiting surveys: ", error);
    res.status(500).json({ message: "Error fetching waiting surveys", error: error.message });
  }
};

// Lista apenas as surveys que estão abertas
exports.getOpenSurveys = async (req, res) => {
  try {
    const surveys = await Survey.find({ open: true });
    res.status(200).json(surveys);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching open surveys', error: error.message });
  }
};

exports.getAllSurveys = async (req, res) => {
  try {
    const surveys = await Survey.find();
    res.status(200).json(surveys);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching surveys', error: error.message });
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

// Método para deletar uma survey
exports.deleteSurvey = async (req, res) => {
  try {
    const surveyId = req.params.id;
    await Survey.findByIdAndDelete(surveyId);
    res.status(200).json({ message: 'Survey deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting survey', error: error.message });
  }
};

// Abrir uma survey
exports.openSurvey = async (req, res) => {
  try {
    const surveyId = req.params.id;
    await Survey.findByIdAndUpdate(surveyId, { open: true });
    res.status(200).json({ message: 'Survey published successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error publishing survey', error: error.message });
  }
};

// Fechar uma survey
exports.closeSurvey = async (req, res) => {
  try {
    const survey = await Survey.findByIdAndUpdate(
      req.params.id, 
      { open: false }, 
      { new: true }
    );
    res.status(200).json(survey);
  } catch (error) {
    res.status(500).json({ message: 'Error closing survey', error: error.message });
  }
};

// Submeter resposta para uma survey
exports.submitResponse = async (req, res) => {
  try {
    const { surveyId, responses } = req.body;

    // Crie um array de respostas com o formato correto
    const formattedResponses = Object.entries(responses).map(([questionId, choice]) => ({
      questionId: questionId,
      choice: choice
    }));

    const newResponse = new Response({
      survey: surveyId,
      responses: formattedResponses,
      respondent: req.user._id // Assegure-se de que o usuário esteja autenticado
    });

    await newResponse.save(); // Salve a nova resposta no banco de dados
    res.status(201).json(newResponse); // Envie a resposta criada de volta ao cliente
  } catch (error) {
    console.error('Error submitting response:', error);
    res.status(500).json({ message: 'Error submitting response', error: error.message });
  }
};
