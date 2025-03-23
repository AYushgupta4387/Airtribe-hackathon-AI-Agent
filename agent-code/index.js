// filepath: c:\Users\diptu\Projects\Airtribe-hackathon-AI-Agent\agent-code\index.js
const express = require('express');
const path = require('path');

const resumeParserRoutes = require('./src/resume-parser/resumeParser');

const app = express();

// Middleware
app.use(express.json());

// Serve static files (e.g., HTML)
app.use(express.static(path.join(__dirname, 'public')));

// Use resume parser routes
app.use('/api/resume', resumeParserRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});