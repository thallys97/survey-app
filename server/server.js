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

const passport = require('passport');
require('./config/passport')(passport); // Config do Passport

app.use(passport.initialize());
app.use(passport.session()); // Se você está usando sessões

const authRoutes = require('./routes/authRoutes');
app.use('/auth', authRoutes);

const session = require('express-session');
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
}));

// Importar rotas
const surveyRoutes = require('./routes/surveyRoutes');

// Usar rotas
app.use('/api/surveys', surveyRoutes);


// Iniciar o servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));