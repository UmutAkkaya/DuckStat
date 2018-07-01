'use strict';

const express = require('express');
const router = new express.Router();

const feedingDb = require('./models/feeding');

router.get('/api/getFeedingList', feedingDb.getFeedings);
router.post('/api/addFeeding', feedingDb.addFeeding);
router.post('/api/setScheduled', feedingDb.setScheduled);

module.exports = router;
