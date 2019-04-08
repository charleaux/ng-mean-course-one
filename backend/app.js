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
    'GET, POST, PATCH, DELETE, OPTIONS, PUT'
  );
  next();
});

app.post('/api/posts', (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  })
  // req.body;
  post.save().then(createdPost => {
    res.status(201).json({
      message: `Post added successfully: ${post}`,
      postId: createdPost._id
    });
  });
});

app.put('/api/posts/:id', (req, res, next) => {
  const post = new Post({
    _id: req.params.id,
    title: req.body.title,
    content: req.body.content
  })
  Post.updateOne({
    _id: req.params.id
  }, post).then((result) => {
    console.log(result);
    res.status(200).json({
      message: "Update Successful!"
    })
  })

})

app.get('/api/posts', (req, res, next) => {
  Post.find().then(posts => {
    res.status(200).json({
      message: 'Posts fetched succesfully!',
      posts
    });
  });
});

app.get('/api/posts/:id', (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if (post !== undefined) {
      res.status(200).json({
        message: 'Post fetched succesfully!',
        post
      });
    } else {
      res.status(404).json({
        message: 'Posts not found!'
      });
    }

  });
});

app.delete('/api/posts/:id', (req, res, next) => {
  Post.deleteOne({
    _id: req.params.id
  }).then((result) => {
    console.log(result);
    res.status(200).json({
      message: "Post deleted!"
    });
  });
});

module.exports = app;
