const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// Carregar variáveis de ambiente
dotenv.config();

// Conectar ao MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('MongoDB connected...'))
.catch(err => console.log(err));


// Configuração do CORS
const corsOptions = {
  origin: process.env.CLIENT_URL, // ou o URL do seu front-end em produção
  credentials: true, // permite enviar e receber cookies
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204
};



// Inicializar o aplicativo Express
const app = express();

app.use(cors(corsOptions)); // Use CORS antes das suas rotas

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
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true
  }
}));

if (process.env.NODE_ENV === "production") {
  app.set('trust proxy', 1); // Trust first proxy
  sess.cookie.secure = true; // Serve secure cookies
}

// Importar rotas
const surveyRoutes = require('./routes/surveyRoutes');

// Usar rotas
app.use('/api/surveys', surveyRoutes);


// Iniciar o servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));