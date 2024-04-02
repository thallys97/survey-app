const mongoose = require('mongoose');

// Esquema para o usuário
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
  // Aqui você pode adicionar mais campos conforme necessário
});

module.exports = mongoose.model('User', userSchema);
