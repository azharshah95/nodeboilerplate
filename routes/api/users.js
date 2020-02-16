const express = require('express');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const keys = require('../../config/keys');
const passport = require('passport');

// Load Input Validation
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

// Load User Model
const User = require('../../models/User');

// @route   GET api/users/test
// @desc    Tests user route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'User Works' }));
// router.get('/test', async (req, res) => res.json({ msg: 'User Works' }));


// @route   POST api/users/register
// @desc    Register user
// @access  Public

// router.post('/register', async (req, res) => {
//   const user = await User.findOne({ email: req.body.email })
//   if (user) {
//     return res.status(400).json({ email: 'Email already exists'})
//   } else {
//     const avatar = gravatar.url(req.body.email,{
//       s: '200', // Size
//       r: 'pg',  // Rating
//       d: 'mm'   // Default
//     });

//     const newUser = new User({
//       name: req.body.name,
//       email: req.body.email,
//       avatar,
//       password: req.body.password
//     });
    
//     try {
//       const salt = await bcrypt.genSalt(10);  
//       const hash = await bcrypt.hash(newUser.password, salt);
//       newUser.password = hash;
//       const user = await newUser.save()
//       return res.json(user);
//     } catch (error) {
//       return error;
//     }
//   }
// });

// @route   POST api/users/register
// @desc    Register user
// @access  Public
router.post('/register', (req, res) => {

  const { errors, isValid } = validateRegisterInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email})
    .then(user => {
      if (user) {
        errors.email = 'Email already exists';
        return res.status(400).json(errors)
      } else {
        const avatar = gravatar.url(req.body.email,{
          s: '200', // Size
          r: 'pg',  // Rating
          d: 'mm'   // Default
        });

        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          avatar,
          password: req.body.password
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => res.json(user))
              .catch(err => console.log(err));
          });
        });
      }
    });
});

// @route   POST api/users/login
// @desc    Login user / return token
// @access  Public
router.post('/login', (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body)

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email
  const password = req.body.password
  
  // find user by email
  User
    .findOne({ email })
    .then(user => {
      // Check for user
      if (!user) {
        errors.email = 'User not found';
        return res.status(404).json(errors);
      }

      // Check Password
      bcrypt
        .compare(password, user.password)
        .then(isMatch => {
          if (isMatch) {
            // User matched
            const payload = { id: user.id, name: user.name, avatar: user.avatar }; // create JWT Payload

            // Sign Token
            jwt.sign(
              payload,
              keys.secretOrKey,
              { expiresIn: 3600 },
              (err, token) => {
                if (err) throw err;
                res.json({ 
                  success: true,
                  token: 'Bearer ' + token
                }); 
              });
          } else {
            return res.status(400).json({ password: 'Password Incorrect' });
          }
        });
    });
});

// @route   GET api/users/current
// @desc    Return current user
// @access  Private
router.get(
  '/current',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email
    })
  }
)

module.exports = router;