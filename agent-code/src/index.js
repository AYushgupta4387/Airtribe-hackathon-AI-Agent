const express = require('express');

// Entry point for the application

// Import necessary modules

// Initialize the app
const app = express();

// Middleware
app.use(express.json());

// Define routes
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});