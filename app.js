require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const NotFoundError = require('./errors/NotFoundError');

const auth = require('./middlewares/auth');
const {
  validateUserBody,
  validateLoginBody,
} = require('./middlewares/validateJoi');

const {
  createUser,
  loginUser,
} = require('./controllers/users');

const { PORT = 3000, MONGO_URI = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/signup', validateUserBody, createUser);
app.post('/signin', validateLoginBody, loginUser);

app.use(auth);

app.use(usersRouter);
app.use(cardsRouter);

app.use('*', (req, res, next) => {
  next(new NotFoundError('Page not found'));
});

app.use(errors()); // ? joi celebrate errors

app.use((err, req, res, next) => {
  console.error(err.statusCode);
  console.error(err.message);
  const { statusCode = 500, message = 'На сервере произошла ошибка' } = err;
 // res.status(statusCode).send({ message });
 res.status(statusCode).send({ err });
});

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
