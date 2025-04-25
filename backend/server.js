const express = require('express');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./auth');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, '../dist')));

// Routes
app.use('/api/auth', authRoutes);

// Handle all other routes by serving the index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/taskpane.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
}); 