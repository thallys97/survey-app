const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Carregar variáveis de ambiente
dotenv.config();

// Conectar ao MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.log(err));

// Inicializar o aplicativo Express
const app = express();

// Middleware para analisar JSON
app.use(express.json());

// Definir rotas (aqui você vai incluir seus arquivos de rotas)
// Exemplo: app.use('/api/surveys', require('./routes/surveyRoutes'));

// Iniciar o servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));