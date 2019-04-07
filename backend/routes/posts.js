const express = require('express');

const Post = require('../models/post');


const router = express.Router()

router.post('', (req, res, next) => {
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

router.put('/:id', (req, res, next) => {
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

router.get('', (req, res, next) => {
  Post.find().then(posts => {
    res.status(200).json({
      message: 'Posts fetched succesfully!',
      posts
    });
  });
});

router.get('/:id', (req, res, next) => {
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

router.delete('/:id', (req, res, next) => {
  Post.deleteOne({
    _id: req.params.id
  }).then((result) => {
    console.log(result);
    res.status(200).json({
      message: "Post deleted!"
    });
  });
});

module.exports = router;
