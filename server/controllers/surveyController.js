const Survey = require('../models/Survey');
const Response = require('../models/Response');
const User = require('../models/User');

// Cria uma nova survey
exports.createSurvey = async (req, res) => {
  try {
    const { title, questions, createdBy } = req.body;

    // Encontre o usuário com base no ID fornecido no corpo da requisição
    const user = await User.findById(createdBy);
    
    // Se o usuário não for encontrado, envie uma resposta de erro
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Se o usuário for encontrado, crie a survey com o usuário como createdBy
    const survey = new Survey({ title, questions, createdBy: user._id });
    
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

exports.getRespondedSurveys = async (req, res) => {
  try {
    const surveys = await Survey.find({ open: false }).lean();
    const respondedSurveys = [];

    for (let survey of surveys) {
      const responses = await Response.find({ survey: survey._id });
      if (responses.length > 0) {
        respondedSurveys.push(survey);
      }
    }

    res.json(respondedSurveys);
  } catch (error) {
    console.error("Error fetching Responded surveys: ", error);
    res.status(500).json({ message: "Error fetching Responded surveys", error: error.message });
  }
};

exports.getSurveyResults = async (req, res) => {
  try {
    const surveyId = req.params.id;
    const survey = await Survey.findById(surveyId).lean();
    const responses = await Response.find({ survey: surveyId });

    // Inicializar resultados
    let results = survey.questions.map(question => ({
      questionId: question._id.toString(),
      text: question.text,
      choices: question.choices.map(choice => ({
        choice: choice,
        count: 0
      }))
    }));

    // Contar as respostas
    responses.forEach(response => {
      response.responses.forEach(answer => {
        const questionResult = results.find(result => result.questionId === answer.questionId.toString());
        if (questionResult) {
          const choice = questionResult.choices.find(c => c.choice === answer.choice);
          if (choice) {
            choice.count++;
          }
        }
      });
    });

    res.json({ survey, results });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching survey results', error: error.message });
  }
};

// Lista apenas as surveys que estão abertas e ainda não respondidas pelo usuário
exports.getOpenSurveys = async (req, res) => {
  try {
    // Recupere o ID do usuário respondente da query string, se fornecido
    const respondentId = req.query.respondent || req.user._id;

    // Encontre o usuário com base no ID fornecido
    const respondent = await User.findById(respondentId);
    
    // Se o usuário não for encontrado, envie uma resposta de erro
    if (!respondent) {
      return res.status(404).json({ message: 'User not found' });
    }

    let surveys = await Survey.find({ open: true }).lean();
    
    // Filtre as surveys para excluir aquelas já respondidas pelo usuário fornecido
    const respondedSurveys = await Response.find({ respondent: respondent._id });
    const respondedSurveyIds = respondedSurveys.map((response) => response.survey.toString());
    surveys = surveys.filter((survey) => !respondedSurveyIds.includes(survey._id.toString()));

    // Execute a contagem de respostas para cada survey
    const surveysWithCounts = await Promise.all(surveys.map(async (survey) => {
      const responsesCount = await Response.countDocuments({ survey: survey._id });
      return { ...survey, responsesCount };
    }));

    // Remova a contagem de respostas daquelas surveys às quais o usuário já respondeu
    const filteredSurveys = surveysWithCounts.filter(survey => 
      !respondedSurveyIds.includes(survey._id.toString())
    );

    res.status(200).json(filteredSurveys);
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
    const { surveyId, responses, respondent } = req.body;

    // Encontre o usuário com base no ID fornecido no corpo da requisição
    const user = await User.findById(respondent);
    
    // Se o usuário não for encontrado, envie uma resposta de erro
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Crie um array de respostas com o formato correto
    const formattedResponses = Object.entries(responses).map(([questionId, choice]) => ({
      questionId: questionId,
      choice: choice
    }));

    const newResponse = new Response({
      survey: surveyId,
      responses: formattedResponses,
      respondent: user._id // Assegure-se de que o usuário esteja autenticado
    });

    await newResponse.save(); // Salve a nova resposta no banco de dados
    res.status(201).json(newResponse); // Envie a resposta criada de volta ao cliente
  } catch (error) {
    console.error('Error submitting response:', error);
    res.status(500).json({ message: 'Error submitting response', error: error.message });
  }
};
