const express = require('express');
const passport = require('passport');
const router = express.Router();
const User = require('../models/User');

const LocalStrategy = require('passport-local').Strategy;




router.post('/register', (req, res) => {
    console.log('Request Body:', req.body); // Log the request body for debugging

    const { username, email, password } = req.body; // Extract username, email, and password

    // Log the individual values for debugging
    console.log('Username:', username);
    console.log('Email:', email);
    console.log('Password:', password);

    // Create a new user instance
    const newUser   = new User({ username, email , password });

    // Register the user with the password
    User.register(newUser , password, (err) => {
        console.log('Error:', err); // Log any error that occurs
        if (err) {
            req.flash('error_msg', 'Registration failed: ' + err.message);
            return res.redirect('/register');
        }
        req.flash('success_msg', 'You are now registered');
        res.redirect('/login');
    });
});


// Login Route
router.get('/login', (req, res) => {
    // Check if the user is already authenticated
    if (req.isAuthenticated()) {
        return res.redirect('/'); // Redirect to the dashboard if logged in
    }
    res.render('login'); // Render the login page if not logged in
});

// Login Route
router.post('/login', (req, res, next) => {
    passport.use(new LocalStrategy({ usernameField: 'email' }, User.authenticate()));
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err); // Handle error
        }
        if (!user) {
            req.flash('error_msg', 'Invalid email or password.'); // Update error message
            return res.redirect('/login');
        }
        req.logIn(user, (err) => {
            if (err) {
                return next(err); // Handle error
            }
            return res.redirect('/'); // Redirect to dashboard or another page
        });
    })(req, res, next);
});

// Dashboard Route




// GET logout
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.redirect('/dashboard');
        }
        res.clearCookie('connect.sid'); // Clear the session cookie
        res.redirect('/');
    });
});


// Registration Route
router.get('/register', (req, res) => {
    res.render('register'); // Create a register.ejs file in the views folder
});


// GET account page
router.get('/account', (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/login'); // Redirect to login if not authenticated
    }
    res.render('account', { user: req.user }); // Render the account page with user info
});



// POST update user information
router.post('/account', async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/login'); // Redirect to login if not authenticated
    }

    const { username, email } = req.body; // Extract username and email from the form

    try {
        // Update user information
        const updatedUser  = await User.findByIdAndUpdate(req.user._id, { username, email }, { new: true });
        req.flash('success_msg', 'Information updated successfully.');
        res.redirect('/account'); // Redirect back to the account page
    } catch (err) {
        req.flash('error_msg', 'Error updating information: ' + err.message);
        res.redirect('/account');
    }
});

// POST change password
router.post('/change-password', (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/login'); // Redirect to login if not authenticated
    }

    const { currentPassword, newPassword, confirmPassword } = req.body;

    // Check if new password and confirm password match
    if (newPassword !== confirmPassword) {
        req.flash('error_msg', 'New password and confirmation do not match.');
        return res.redirect('/account');
    }

    // Change the password
    req.user.changePassword(currentPassword, newPassword, (err) => {
        if (err) {
            req.flash('error_msg', 'Error changing password: ' + err.message);
            return res.redirect('/account');
        }
        req.flash('success_msg', 'Password changed successfully.');
        res.redirect('/account'); // Redirect back to the account page
    });
});



// // GET: Form page
// router.get('/submit' ,(req, res) => {

//     res.render('submit',{ user: req.user } );
// });


module.exports = router; 