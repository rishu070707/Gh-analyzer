const express = require('express');
const router = express.Router();
const repoController = require('../controllers/repoController');

// Route to analyze a repository by URL
router.post('/analyze', repoController.analyzeRepo);

module.exports = router;
