const express = require('express');
const mongoose = require('mongoose');
const tradeRoutes = require('./routes/traderoutes');
require('dotenv').config();

const app = express();

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error(err));

//express middleware
app.use(express.json());
app.use('/api/trades', tradeRoutes); // Use trade routes

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});