const mongoose = require('mongoose');

// Esquema para a survey
const surveySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  questions: [{
    text: String,
    choices: [String] // Array de strings para as opções
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  open: {
    type: Boolean,
    default: true
  }
  // Campos adicionais para datas de início e fim, etc, podem ser adicionados aqui
});

module.exports = mongoose.model('Survey', surveySchema);
