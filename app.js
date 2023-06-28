const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cors = require('cors');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const NotFoundError = require('./errors/NotFoundError');
const errorHandler = require('./middlewares/errorHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT, MONGO_URI = 'mongodb://127.0.0.1:27017/mestodb' } = require('./config');

const app = express();

app.use(cors({
  origin: [
    'https://localhost:3000',
    'http://localhost:3000',
    'http://picventures.nomoreparties.sbs',
    'https://picventures.nomoreparties.sbs',
    'http://api.picventures.nomoreparties.sbs',
    'https://api.picventures.nomoreparties.sbs',
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use(requestLogger);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//! CRASH TEST REMOVE!!
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use(usersRouter);
app.use(cardsRouter);

app.use('*', (req, res, next) => {
  next(new NotFoundError('Page not found'));
});

app.use(errorLogger);
app.use(errors()); // ? joi celebrate errors
app.use(errorHandler); // ? middleware for errors

mongoose.connect(MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.info(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
