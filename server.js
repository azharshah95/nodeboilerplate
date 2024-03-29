const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const cors = require('cors');
const dotenv = require('dotenv').config()

// DB Config
const db = require('./config/keys');

const app = express();

app.use(express.static(__dirname + "/public"));

app.use(cors());
app.options('*', cors())

// Routes
const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');
const oauth = require('./routes/oauth');

// Body Parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Use Routes
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);
app.use('/oauth', oauth);

// Connect to mongodb
mongoose
  .connect(db.mongoURI, db.options)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

app.get('/', (req, res) => res.send('Hello'));

// Passport middleware
app.use(passport.initialize());

// Passport config
require('./config/passport')(passport);

// PORT
const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));
