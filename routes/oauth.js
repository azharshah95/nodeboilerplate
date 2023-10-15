const express = require('express');
const router = express.Router();

// @route   GET api/oauth/test
// @desc    Tests oauth route
// @access  Public
router.get('/test', async (req, res) => res.json({ msg: 'OAuth Works' }));

// @route   GET api/oauth/redirect
// @desc    Redirects oauth route
// @access  Public
router.get('/redirect', async (req, res) => res.json({ msg: 'OAuth Redirects' }));

module.exports = router;