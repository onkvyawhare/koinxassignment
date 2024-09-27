// src/routes/tradeRoutes.js
const express = require('express');
const multer = require('multer');
const { uploadTrades, getBalanceAtTimestamp } = require('../controllers/Tradecontroller');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// Route to upload CSV
router.post('/upload', upload.single('file'), uploadTrades);

// Route to get asset-wise balance at a given timestamp
router.post('/balance', getBalanceAtTimestamp);

// Export the router
module.exports = router;
