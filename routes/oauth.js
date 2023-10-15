const express = require('express');
const axios = require('axios');
const router = express.Router();

// This is the client ID and client secret that you obtained
// while registering the application
const clientID = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;

// @route   GET api/oauth/test
// @desc    Tests oauth route
// @access  Public
router.get('/test', async (req, res) => res.json({ msg: 'OAuth Works' }));

// @route   GET api/oauth/redirect
// @desc    Redirects oauth route
// @access  Public
router.get('/redirect', (req, res) => {
  // The req.query object has the query params that
  // were sent to this route. We want the `code` param
  const requestToken = req.query.code;
  axios({
    // make a POST request
    method: "post",
    // to the Github authentication API, with the client ID, client secret
    // and request token
    url: `https://github.com/login/oauth/access_token?client_id=${clientID}&client_secret=${clientSecret}&code=${requestToken}`,
    // Set the content type header, so that we get the response in JSOn
    headers: {
      accept: "application/json",
    },
  }).then((response) => {
    // Once we get the response, extract the access token from
    // the response body
    const accessToken = response.data.access_token;
    // redirect the user to the welcome page, along with the access token
    res.redirect(`/welcome.html?access_token=${accessToken}`);
  });
});

module.exports = router;