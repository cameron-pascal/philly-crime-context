const express = require('express');
const router = express.Router();

const repository = require('../repository');

router.get('/', function(req, res) {
    res.sendFile('../public/index.html')
});

router.get('/api/crimes', repository.getCrimesInRange);

module.exports = router;