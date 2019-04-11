const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const router = express.Router();

router.post('/signup', async (req, res, next) => {
  try {
    const hash = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      email: req.body.email,
      password: hash
    });
    const result = await user.save();
    res.status(201).json({ message: 'User created!', result });
  } catch (error) {
    res.status(500).json({ error });
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ message: 'User email not found.' });
    }

    const result = await bcrypt.compare(req.body.password, user.password);
    if (!result) {
      return res.status(401).json({ message: 'Auth failed' });
    }

    const token = jwt.sign(
      { email: user.email, userId: user._id },
      process.env.JWTSECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ token });
  } catch (err) {
    let errorMessage = {
      message: 'Something went wrong! Check the server logs...'
    };

    if (process.env.NODE_ENV === 'development') {
      errorMessage = {
        ...errorMessage,
        message: err.message
      };
    }
    console.log('Error thrown: ', err);
    res.status(500).json({ errorMessage });
  }
});

module.exports = router;
