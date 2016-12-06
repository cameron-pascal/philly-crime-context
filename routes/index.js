const express = require('express');
const router = express.Router();

const repository = require('../repository');

router.get('/', function(req, res) {
    res.sendFile('../public/index.html')
});

router.get('/api/crimes', repository.getCrimesInRange);

router.get('/api/crimes/:tractId', repository.getTractSummary);
router.get('/api/filter', repository.getFilterGIDs)

module.exports = router;