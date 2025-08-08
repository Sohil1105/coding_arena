const mongoose = require('mongoose');

// Defines the schema for the User model
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    college: { type: String },
    profilePicture: { type: String },
    role: { type: String, default: 'user' },
});

module.exports = mongoose.model('User', userSchema);
