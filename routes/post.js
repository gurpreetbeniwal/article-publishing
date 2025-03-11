const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Content = require('../models/Content');

const router = express.Router();

// GET: Display content for the logged-in user
router.get('/mypost', async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/login'); // Redirect to login if not authenticated
    }

    try {
        // Fetch content for the logged-in user by email
        const contents = await Content.find({ email: req.user.email }); // Filter by email
        res.render('mypost', { contents, user: req.user }); // Render the EJS file
    } catch (err) {
        console.error("Error fetching content:", err);
        req.flash('error_msg', 'Error fetching content.');
        res.redirect('/');
    }
});

// GET: Display a specific post
router.get('/post/:postID', async (req, res) => {
    try {
        const postID = req.params.postID; // Get the post ID from the URL
        const post = await Content.findById(postID); // Fetch the post from the database

        if (post) {
            // Pass the entire post object to the view
            res.render('post', { post });
        } else {
            res.status(404).send('Post not found');
        }
    } catch (err) {
        console.error("Error fetching post:", err);
        res.status(500).send('Internal Server Error');
    }
});



// DELETE: Handle post deletion
router.get('/delete/:postID', async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(403).send('Unauthorized'); // User must be authenticated
    }

    try {
        const postID = req.params.postID; // Get the post ID from the URL
        const post = await Content.findById(postID); // Fetch the post from the database

        if (!post) {
            return res.status(404).send('Post not found');
        }

        // Check if the email matches the logged-in user's email
        if (post.email !== req.user.email) {
            return res.status(403).send('You are not authorized to delete this post');
        }

        // Delete the post
        await Content.findByIdAndDelete(postID);
        req.flash('success_msg', 'Post deleted successfully.');
        res.redirect('/mypost'); // Redirect to the user's posts page
    } catch (err) {
        console.error("Error deleting post:", err);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;