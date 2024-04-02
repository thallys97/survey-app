const mongoose = require('mongoose');

// Esquema para as respostas
const responseSchema = new mongoose.Schema({
  survey: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Survey',
    required: true
  },
  responses: [{
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    choice: String
  }],
  respondent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
  // Adicione campos adicionais se necessário
});

module.exports = mongoose.model('Response', responseSchema);