const mongoose = require('mongoose');
const User = require('./models/user');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const users = [
    {
        username: 'admin',
        email: 'admin@example.com',
        password: 'admin123',
        role: 'admin'
    },
    {
        username: 'user1',
        email: 'user1@example.com',
        password: 'user123',
        role: 'user'
    }
];

const seedUsers = async () => {
    const mongoUrl = process.env.MONGO_URL || 'mongodb://mongo:27017/codingarena';
    await mongoose.connect(mongoUrl);

    await User.deleteMany({});

    for (const user of users) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        user.password = hashedPassword;
        const newUser = new User(user);
        await newUser.save();
    }

    console.log('Users collection seeded!');
    mongoose.connection.close();
};

seedUsers();
