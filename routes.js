'use strict';

const express = require('express');
const router = new express.Router();

const feedingController = require('./feedingController');

router.get('/api/getFeedingList', feedingController.getFeedings);
router.post('/api/addFeeding', feedingController.addFeeding);
router.post('/api/setScheduled', feedingController.setScheduled);

module.exports = router;
