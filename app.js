const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cors = require('cors');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const NotFoundError = require('./errors/NotFoundError');
const errorHandler = require('./middlewares/errorHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT, MONGO_URI } = require('./config');

const app = express();

const allowedCors = [
  'https://localhost:3000',
  'http://localhost:3000',
  'http://picventures.nomoreparties.sbs',
  'https://picventures.nomoreparties.sbs',
  'http://api.picventures.nomoreparties.sbs',
  'https://api.picventures.nomoreparties.sbs',
];

app.use(
  cors({
    origin: allowedCors,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  }),
);

app.use(requestLogger);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://picventures.nomoreparties.sbs');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
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
