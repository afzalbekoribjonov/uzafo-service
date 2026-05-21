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
app.all('/health', (req, res) => {
  if (req.method === 'HEAD' || req.method === 'GET') {
    return res.status(200).send('OK');
  }
  res.status(405).send('Method Not Allowed');
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/clients', require('./routes/clientRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));

// Serve Frontend Build
const productionDist = path.join(__dirname, '../../frontend/dist');
app.use(express.static(productionDist));

// Handle SPA and 404s
app.use((req, res, next) => {
  // If it's an API request that wasn't caught by the routes above, return 404
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'API endpoint topilmadi' });
  }
  // For all other requests (web pages, non-existent slugs), serve the SPA
  // React Router will handle the 404 UI on the client side
  res.sendFile(path.join(productionDist, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
