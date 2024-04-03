const mongoose = require('mongoose');

// Esquema para o usuário
const userSchema = new mongoose.Schema({
  googleId: {
    type: String,
    required: false, // Não é necessário se o usuário não está usando o login do Google
    unique: true,
    sparse: true // Isso permite valores nulos para este campo e mantém a indexação única
  },
  displayName: {
    type: String,
    required: false // Se você decidir armazenar o nome do perfil do Google
  },
  username: {
    type: String,
    required: false, // Isso pode ser opcional se você estiver usando OAuth
    unique: true,
    sparse: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: false // Isso não é mais necessário com OAuth
  },
  image: {
    type: String,
    required: false // Se você decidir armazenar a imagem de perfil do Google
  },
  role: {
    type: String,
    enum: ['SurveyCoordinator', 'SurveyRespondent'],
    required: true,
    default: 'SurveyRespondent' // O padrão pode ser definido com base na lógica do seu aplicativo
  }
});

module.exports = mongoose.model('User', userSchema);

