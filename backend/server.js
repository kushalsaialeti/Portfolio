require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cmsRoutes = require('./routes/cmsRoutes');
const sectionRoutes = require('./routes/sectionRoutes');
const authRoutes = require('./routes/authRoutes');
const contactRoutes = require('./routes/contactRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', cmsRoutes);
app.use('/api/sections', sectionRoutes);
app.use('/api/contact', contactRoutes);

// Health Check
app.get('/', (req, res) => res.send('Portfolio CMS API is online.'));

// Database & Server
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio-cms')
  .then(() => {
    console.log('MongoDB Connected successfully.');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error('Database connection error:', err));
