const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Content = require('../models/Content');
const User = require('../models/User');

const LocalStrategy = require('passport-local').Strategy;

const router = express.Router();
router.use(express.static(path.join(__dirname, 'public')));
// Home route to display initial posts
router.get('/', async (req, res) => {
    try {
        const posts = await Content.find({ status: true })
            .sort({ createdAt: -1 })
            .limit(4);

        // Pass the entire user object instead of just username
        res.render('index', { 
            posts,
            user: req.user // Changed from "username" to "user"
        });
    } catch (err) {
        console.error("Error fetching posts:", err);
        req.flash('error_msg', 'Error fetching posts.');
        res.redirect('/');
    }
});

// Route to load more posts
router.get('/load-more/:skip', async (req, res) => {
    const skip = parseInt(req.params.skip); // Get the number of posts to skip
    try {
        const posts = await Content.find({ status: true }) // Fetch only posts with status true
            .sort({ createdAt: -1 }) // Sort by createdAt in descending order
            .skip(skip) // Skip the specified number of posts
            .limit(4); // Load the next 4 posts
        res.json(posts); // Return the posts as JSON
    } catch (err) {
        console.error("Error fetching more posts:", err);
        res.status(500).json({ error: 'Error fetching more posts.' });
    }
});


router.get('/article', async (req, res) => {
    try {
        const filter = { 
            status: true, 
            contentType: 'article' 
        };

        const posts = await Content.find(filter)
            .sort({ createdAt: -1 })
            .limit(4);

        res.render('article', { 
            posts,
            user: req.user // Send user data to the view
        });

    } catch (err) {
        console.error("Error fetching posts:", err);
        req.flash('error_msg', 'Error fetching posts.');
        res.redirect('/');
    }
});
// Route to load more posts
router.get('/load-article/:skip', async (req, res) => {
    const skip = parseInt(req.params.skip); // Get the number of posts to skip
    try {
        const posts = await Content.find({ status: true, contentType: 'article' }) // Fetch only articles with status true
            .sort({ createdAt: -1 }) // Sort by createdAt in descending order
            .skip(skip) // Skip the specified number of posts
            .limit(4); // Load the next 4 posts
        res.json(posts); // Return the posts as JSON
    } catch (err) {
        console.error("Error fetching more posts:", err);
        res.status(500).json({ error: 'Error fetching more posts.' });
    }
});

// Route to fetch reports
router.get('/report', async (req, res) => {
    try {
        const filter = { 
            status: true, 
            contentType: 'report' 
        };

        const posts = await Content.find(filter)
            .sort({ createdAt: -1 })
            .limit(4);

        res.render('reports', { 
            posts,
            user: req.user // Pass user data to view
        });

    } catch (err) {
        console.error("Error fetching reports:", err);
        req.flash('error_msg', 'Error fetching reports.');
        res.redirect('/');
    }
});

// Route to load more reports
router.get('/load-report/:skip', async (req, res) => {
    const skip = parseInt(req.params.skip); // Get the number of posts to skip
    try {
        const posts = await Content.find({ status: true, contentType: 'book' }) // Fetch only reports with status true
            .sort({ createdAt: -1 }) // Sort by createdAt in descending order
            .skip(skip) // Skip the specified number of posts
            .limit(4); // Load the next 4 posts
        res.json(posts); // Return the posts as JSON
    } catch (err) {
        console.error("Error fetching more posts:", err);
        res.status(500).json({ error: 'Error fetching more posts.' });
    }
});
// Route to fetch reports
router.get('/book', async (req, res) => {
    try {
        const filter = { 
            status: true, 
            contentType: 'book' 
        };

        const posts = await Content.find(filter)
            .sort({ createdAt: -1 })
            .limit(4);

        res.render('book', { 
            posts,
            user: req.user // Pass user data to view
        });

    } catch (err) {
        console.error("Error fetching books:", err);
        req.flash('error_msg', 'Error fetching books.');
        res.redirect('/');
    }
});

// Route to load more reports
router.get('/load-book/:skip', async (req, res) => {
    const skip = parseInt(req.params.skip); // Get the number of posts to skip
    try {
        const posts = await Content.find({ status: true, contentType: 'report' }) // Fetch only reports with status true
            .sort({ createdAt: -1 }) // Sort by createdAt in descending order
            .skip(skip) // Skip the specified number of posts
            .limit(4); // Load the next 4 posts
        res.json(posts); // Return the posts as JSON
    } catch (err) {
        console.error("Error fetching more posts:", err);
        res.status(500).json({ error: 'Error fetching more posts.' });
    }
});



module.exports = router;