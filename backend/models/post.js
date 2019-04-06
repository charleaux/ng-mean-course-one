const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
  title: {
    type: String,
    requrired: true
  },
  content: {
    type: String,
    requrired: true
  }
});


module.exports = mongoose.model('Post', postSchema);
