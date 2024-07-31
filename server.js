// server.js
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

mongoose.connect('mongodb://localhost:27017/mydatabase', { useNewUrlParser: true, useUnifiedTopology: true });

const User = mongoose.model('User', {
    name: String,
    email: String,
    password: String
});

app.use(express.json());

app.post('/register', (req, res) => {
    const { name, email, password } = req.body;

    User.findOne({ email }, (err, user) => {
        if (err) {
            console.error(err);
            res.status(500).send({ message: 'Error occurred' });
        } else if (user) {
            res.status(400).send({ message: 'Email already exists' });
        } else {
            const hashedPassword = bcrypt.hashSync(password, 10);
            const newUser = new User({ name, email, password: hashedPassword });
            newUser.save((err) => {
                if (err) {
                    console.error(err);
                    res.status(500).send({ message: 'Error occurred' });
                } else {
                    res.send({ message: 'User created successfully' });
                }
            });
        }
    });
});

app.listen(3000, () => {
    console.log('Server listening on port 3000');
});
