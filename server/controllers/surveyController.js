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

// Lista todas as surveys
exports.getAllSurveys = async (req, res) => {
  try {
    const surveys = await Survey.find();
    res.status(200).json(surveys);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching surveys', error: error.message });
  }
};
