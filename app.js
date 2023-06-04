const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const usersRouter = require('./routes/users');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(usersRouter);

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
