const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const postRoutes = require('./routes/posts');

const app = express();

const mongoUser = process.env.MONGOUSER;
const password = process.env.PASSWORD;
const mongoHost = process.env.MONGOHOST;
const mongoDatabase = process.env.MONGODATABASE;
const mongoUrlPrefix = process.env.MONGOURLPREFIX

mongoose
  .connect(
    `${mongoUrlPrefix}://${mongoUser}:${password}@${mongoHost}/${mongoDatabase}?retryWrites=true`
  )
  .then(() => {
    console.log('connected to database');
  })
  .catch(error => {
    console.log('Error happened: ', error);
  });

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, DELETE, OPTIONS, PUT'
  );
  next();
});

app.use('/api/posts', postRoutes);

module.exports = app;
