const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');



const Post = require('./models/post');

const app = express();

const password = process.env.PASSWORD;

mongoose.connect(`mongodb+srv://charles:${password}@cluster0-njskc.mongodb.net/node-angular?retryWrites=true`).then(() => {
  console.log("connected to database")
}).catch((error) => {
  console.log("Error happened: ", error)
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, DELETE, OPTIONS'
  );
  next();
});

app.post('/api/posts', (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  })
  // req.body;
  post.save();

  res.status(201).json({
    message: `Post added successfully: ${post}`
  });
});

app.get('/api/posts', (req, res, next) => {
  Post.find().then(posts => {
    res.status(200).json({
      message: 'Posts fetched succesfully!',
      posts
    });
  });

});

module.exports = app;
