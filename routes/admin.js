const express = require('express');
const argon2 = require('argon2'); // Using Argon2 for password hashing
const Admin = require('../models/admin'); // Import Admin model
const router = express.Router();
const path = require('path');
const fs = require('fs');
const session = require('express-session');
const Content = require('../models/Content');
const User = require('../models/User'); // Import your User model
router.use(express.static(path.join(__dirname, 'public')));

// Admin Signup Route
router.get('/admin/signup', (req, res) => {


       return res.render('admin/register');
    
    
   
});

router.post('/admin/signup', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.send('Admin already exists!');
        }

        // Hash password before saving
        const hashedPassword = await argon2.hash(password);
        const newAdmin = new Admin({ email, password: hashedPassword });
        await newAdmin.save();

        res.redirect('/admin/logina'); // Redirect to login page after signup
    } catch (error) {
        res.status(500).send('Error creating admin');
    }
});

// Admin Login Route
router.get('/admin/logina', (req, res) => {
    res.render('admin/login'); // Render login form
});

router.post('/admin/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await Admin.findOne({ email });

        if (!admin) {
            return res.send('Admin not found!');
        }

        // Compare password using Argon2
        const isMatch = await argon2.verify(admin.password, password);
        if (!isMatch) {
            return res.send('Invalid credentials!');
        }

        req.session.adminId = admin._id; // Store admin session
        res.redirect('/admin/dashboard'); // Redirect to dashboard
    } catch (error) {
        res.status(500).send('Login error');
    }
});

// Admin Dashboard (Protected Route)
router.get('/admin/dashboard', (req, res) => {
    if (!req.session.adminId) {
        return res.redirect('/admin/logina');
    }
    // res.send("hi bro you are in ")
    res.redirect('/dash');
});



router.get('/dash', async (req, res) => {
    try {
        if (!req.session.adminId) {
            return res.redirect('/admin/logina');
        }

        // Get all counts in parallel
        const [totalContents, articleCount, bookCount, reportCount, userCount] = await Promise.all([
            Content.countDocuments(),
            Content.countDocuments({ contentType: 'article' }),
            Content.countDocuments({ contentType: 'book' }),
            Content.countDocuments({ contentType: 'report' }),
            User.countDocuments()
        ]);

        res.render('dash', {
            stats: {
                totalContents,
                articleCount,
                bookCount,
                reportCount,
                userCount
            }
        });

    } catch (err) {
        console.error("Dashboard error:", err);
        req.flash('error_msg', 'Error loading dashboard');
        res.redirect('/admin/logina');
    }
});
// Admin Logout
router.get('/admin/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/admin/logina');
    });
});


router.get('/dash-panding', async (req, res) => {
    if (!req.session.adminId) {
        return res.redirect('/admin/logina');
    }

    try {
        // Fetch content for the logged-in user by email
        const contents = await Content.find({ status: false  }); // Filter by email
        res.render('dash-panding', { contents, user: req.user }); // Render the EJS file
    } catch (err) {
        console.error("Error fetching content:", err);
        req.flash('error_msg', 'Error fetching content.');
        res.redirect('/admin/logina');
    }
});


router.get('/all-article', async (req, res) => {
    if (!req.session.adminId) {
        return res.redirect('/admin/logina');
    }

    try {
        // Fetch content of type 'article'
        const contents = await Content.find({ contentType: 'article' }); 
        res.render('all-article', { contents, user: req.user }); // Render the EJS file
    } catch (err) {
        console.error("Error fetching content:", err);
        req.flash('error_msg', 'Error fetching content.');
        res.redirect('/admin/logina');
    }
});
router.get('/all-reports', async (req, res) => {
    if (!req.session.adminId) {
        return res.redirect('/admin/logina');
    }

    try {
        // Fetch content of type 'article'
        const contents = await Content.find({ contentType: 'report' }); 
        res.render('all-reports', { contents, user: req.user }); // Render the EJS file
    } catch (err) {
        console.error("Error fetching content:", err);
        req.flash('error_msg', 'Error fetching content.');
        res.redirect('/admin/logina');
    }
});
router.get('/all-books', async (req, res) => {
    if (!req.session.adminId) {
        return res.redirect('/admin/logina');
    }

    try {
        // Fetch content of type 'article'
        const contents = await Content.find({ contentType: 'book' }); 
        res.render('all-books', { contents, user: req.user }); // Render the EJS file
    } catch (err) {
        console.error("Error fetching content:", err);
        req.flash('error_msg', 'Error fetching content.');
        res.redirect('/admin/logina');
    }
});


router.post('/posts/delete/:id', async (req, res) => {
    if (!req.session.adminId) {
        return res.redirect('/admin/logina');
    }

    try {
        await Content.findByIdAndDelete(req.params.id);
        req.flash('success_msg', 'Post deleted successfully');
        res.redirect('/dash-panding');
    } catch (error) {
        console.error("Error deleting post:", error);
        req.flash('error_msg', 'Internal server error');
        res.redirect('/dash-panding');
    }
});

router.post('/posts/approve/:id', async (req, res) => {
    if (!req.session.adminId) {
        return res.redirect('/admin/logina');
    }
    try {
        await Content.findByIdAndUpdate(req.params.id, { status: true });
        req.flash('success_msg', 'Post approved successfully');
        res.redirect('/dash-panding');
    } catch (error) {
        console.error("Error approving post:", error);
        req.flash('error_msg', 'Internal server error');
        res.redirect('/dash-panding');
    }
});

module.exports = router;
