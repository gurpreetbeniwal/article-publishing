const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/User');
const Content = require('./models/Content'); // Import your Content model
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const authRoutes = require('./routes/loginsigup');
const submitRoutes = require('./routes/submit');
const postRoutes = require('./routes/post');
const postdisplay = require('./routes/postdisplay');
const adminroutes = require('./routes/admin');

require('dotenv').config();

const app = express();

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'public/uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Connect to MongoDB
const mongoURI = 'mongodb+srv://gurpreetbeniwal31386:Gudu999@data.jgsnzrh.mongodb.net/';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true, socketTimeoutMS: 45000 })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

// Middleware
const SECRET_KEY = "3f3c1e2d4b5a6c7d8e9f0a1b2c3d4e5f";
app.use(session({
    secret: SECRET_KEY,
    resave: false,
    saveUninitialized: true
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// Passport configuration
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser (User.serializeUser ());
passport.deserializeUser (User.deserializeUser ());

// Set EJS as templating engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Global variables for flash messages
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    next();
});





// Routes

app.use('/', postdisplay);
app.use('/', authRoutes);
app.use('/', submitRoutes);
app.use('/', postRoutes);
app.use('/', adminroutes);




// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});