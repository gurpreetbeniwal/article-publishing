const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Content = require('../models/Content');

const router = express.Router();

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../public/uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

router.get('/submit', (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/login'); // Redirect to login if not authenticated
    }
    res.render('submit', { user: req.user }); // Render the submit page with user info
});

// POST: Handle form submission
router.post('/submit', upload.single('pdfFile'), async (req, res) => {
    try {
        const { type, title, description, textContent, Username, email, contentType } = req.body;

        console.log(req.body);
        
        let newContent;

        if (type === 'pdf' && req.file) {
            newContent = new Content({
                type,
                title,
                description,
                Username,
                email,
                pdfFile: `/uploads/${req.file.filename}`,
                contentType, // Include the new contentType field
                status: false
            });
        } else if (type === 'text' && textContent.trim()) {
            newContent = new Content({
                type,
                title,
                description,
                Username,
                email,
                textContent,
                contentType, // Include the new contentType field
                status: false
            });
        } else {
            req.flash('error_msg', 'Invalid input. Please provide necessary details.');
            return res.redirect('/submit');
        }

        await newContent.save();
        req.flash('success_msg', 'Content submitted successfully for review.');
        res.redirect('/submit');
    } catch (err) {
        console.error("Error during submission:", err);
        req.flash('error_msg', 'Error submitting content.');
        res.redirect('/submit');
    }
});

module.exports = router;