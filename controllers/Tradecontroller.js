
const Trade =require("../models/Trade")
const csv = require('csv-parser');
const fs = require('fs');

// Function to parse CSV and store trades in the mongo database
const parseCSV = (filePath) => {
  const results = [];
  
  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (data) => {
      const [base_coin, currency_coin] = data['Market'].split('/');
      results.push({
        user_id: parseInt(data['User_ID']),
        utc_time: new Date(data['UTC_Time']),
        operation: data['Operation'].toLowerCase(),
        base_coin,
        currency_coin,
        amount: parseFloat(data['Buy/Sell Amount']),
        price: parseFloat(data['Price']),
      });
    })
    .on('end', async () => {
      await Trade.insertMany(results);
      fs.unlinkSync(filePath); // Remove file after parsing
      console.log('Data uploaded successfully');
    });
};

// Function to handle the upload route
const uploadTrades = (req, res) => {
  const filePath = req.file.path;
  parseCSV(filePath);
  res.status(201).json({ message: 'File is being processed' });
};

// Function to get asset-wise balance at a given timestamp
const getBalanceAtTimestamp = async (req, res) => {
  const { timestamp } = req.body;

  try {
    const trades = await Trade.find({
      utc_time: { $lte: new Date(timestamp) },
    });

    const balances = {};

    trades.forEach((trade) => {
      const amount = parseFloat(trade.amount);
      if (trade.operation === 'buy') {
        balances[trade.base_coin] = (balances[trade.base_coin] || 0) + amount;
      } else {
        balances[trade.base_coin] = (balances[trade.base_coin] || 0) - amount;
      }
    });

    // Ensure all coins are represented in the output
    if (!balances.BTC) balances.BTC = 0;
    if (!balances.MATIC) balances.MATIC = 0;

    res.status(200).json(balances);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving balances', error });
  }
};

module.exports = { uploadTrades, getBalanceAtTimestamp };
