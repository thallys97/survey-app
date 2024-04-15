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

mongoose.set('strictQuery', false);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

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
    secure: process.env.NODE_ENV === 'production', // Só envia o cookie com requisições HTTPS se estiver em produção
    sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax', // Usa 'None' para CORS em produção
    // Outras configurações de cookie podem ser colocadas aqui
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

// For Vercel, we might need to serve the app at the root route.
app.get('/', (req, res) => {
  res.json({ message: 'Server is up and running!' });
});

// Iniciar o servidor
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
