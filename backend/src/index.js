const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Health Check Route
app.get('/health', (req, res) => res.status(200).send('OK'));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/clients', require('./routes/clientRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));

// Serve Frontend Build
const productionDist = path.join(__dirname, '../../frontend/dist');
app.use(express.static(productionDist));

// Handle SPA
app.use((req, res, next) => {
  if (req.path.startsWith('/api') || req.path === '/health') {
    return next();
  }
  res.sendFile(path.join(productionDist, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
