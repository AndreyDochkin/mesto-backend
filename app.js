const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const usersRouter = require('./routes/users');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: '647cda86587d416c8c4e0187'
  };
  next();
});

app.use(usersRouter);
// app.use(cardsRouter);

mongoose.connect('mongodb://127.0.0.1:27017/mestodb')
  .then(() => {
    app.listen(3000, () => {
      console.info('Server is running on port 3000');
    });
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
