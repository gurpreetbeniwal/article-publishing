const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true }, // Ensure email is unique
    password: { type: String, required: true }
});

// Add passport-local-mongoose plugin to the schema
UserSchema.plugin(passportLocalMongoose, { usernameField: 'email' }); // Use email as username

module.exports = mongoose.model('User ', UserSchema);