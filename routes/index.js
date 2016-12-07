const express = require('express');
const router = express.Router();

const repository = require('../repository');

router.get('/', function(req, res) {
    res.sendFile('../public/index.html')
});

//get crimes in range
router.get('/api/tractfilters', repository.getTractFilters);

//sends city-wide summary aswell
router.get('/api/crimes', repository.getCrimesInRange);

//on click sends tract summary
router.get('/api/crimes/:tractId', repository.getTractSummary);

//a new filter has been chosen, sends GIDs that dont match up
router.get('/api/filter', repository.getFilterGIDs);


router.get('/api/political', repository.getWardInfo);

router.get('/api/getalldata', repository.getAllCensusDataWithFilters);

module.exports = router;