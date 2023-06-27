const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cors = require('cors');
// const cors = require('./middlewares/cors');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const NotFoundError = require('./errors/NotFoundError');
const errorHandler = require('./middlewares/errorHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT, MONGO_URI } = require('./config');

const app = express();

const corsOptions = {
  origin: [
    'https://localhost:3000',
    'http://localhost:3000',
    'http://http://picventures.nomoreparties.sbs',
    'https://http://picventures.nomoreparties.sbs',
  ],
  credentials: true,
};

app.use(cors(corsOptions));

app.use(requestLogger);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', usersRouter);
app.use('/api', cardsRouter);

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
