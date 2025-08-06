// User schema for MongoDB
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    college: { type: String },
    profilePicture: { type: String },
});

module.exports = mongoose.model('User', userSchema);
