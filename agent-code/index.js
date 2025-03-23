const express = require('express');

// Entry point for the application

// Import necessary modules
const resumeParserRoutes = require('./src/resume-parser/resumeParser'); // Import resume parser routes

// Initialize the app
const app = express();

// Middleware
app.use(express.json());

// Define routes
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

// Use resume parser routes
app.use('/api/resume', resumeParserRoutes); // Mount resume parser routes under '/api/resume'

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});