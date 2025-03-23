const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const path = require('path');

const router = express.Router(); // Create a router instance

// Configure multer for file uploads
const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'uploads/'); // Directory to save uploaded files
        },
        filename: (req, file, cb) => {
            cb(null, `${Date.now()}-${file.originalname}`);
        },
    }),
    fileFilter: (req, file, cb) => {
        if (path.extname(file.originalname) !== '.pdf') {
            return cb(new Error('Only .pdf files are allowed!'));
        }
        cb(null, true);
    },
});

// Endpoint to handle PDF upload and parsing
router.post('/upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send('No file uploaded.');
        }

        const pdfBuffer = req.file.buffer || require('fs').readFileSync(req.file.path);
        const pdfData = await pdfParse(pdfBuffer);

        res.json({
            text: pdfData.text,
        });
    } catch (error) {
        console.error('Error parsing PDF:', error);
        res.status(500).send('Failed to parse PDF.');
    }
});

module.exports = router; // Export the router