const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const authRoutes = require('./routes/authRoutes');
const surveyRoutes = require('./routes/surveyRoutes');
const userRoutes = require('./routes/userRoutes');

// Carregar variáveis de ambiente
dotenv.config();

// Conectar ao MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('MongoDB connected...'))
.catch(err => console.log(err));

// Inicializar o aplicativo Express
const app = express();

// Configuração do CORS
const corsOptions = {
  origin: process.env.CLIENT_URL, // ou o URL do seu front-end em produção
  credentials: true, // permite enviar e receber cookies
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions)); // Use CORS antes das suas rotas

// Middleware para analisar JSON
app.use(express.json());

// Configuração do express-session
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Assegura-se de que o cookie só será enviado com requisições HTTPS
  }
}));


// Configuração do Passport
require('./config/passport')(passport); // Config do Passport

app.use(passport.initialize());
app.use(passport.session()); // Se você está usando sessões



// Importar rotas


// Usar rotas
app.use('/auth', authRoutes);
app.use('/api/surveys', surveyRoutes);
app.use('/api/users', userRoutes);


// Iniciar o servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));