const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 5500;

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname)); // Serves static files (HTML, CSS, JS)

// MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/Student', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', (err) => console.error(' MongoDB connection error:', err));
db.once('open', () => console.log(' MongoDB connected successfully'));

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  state: { type: String, required: true },
  city: { type: String, required: true },
  password: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

// Serve Signup Page
app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'signup.html'));
});

// Handle Signup Request
app.post('/signup', async (req, res) => {
  try {
    const { name, phone, email, state, city, password } = req.body;

    if (!name || !phone || !email || !state || !city || !password) {
      return res.status(400).send(' All fields are required.');
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send(' User with this email already exists.');
    }

    const newUser = new User({ name, phone, email, state, city, password });
    await newUser.save();

    console.log(' User signed up successfully');
    res.send(' Signup successful!');
  } catch (err) {
    console.error(' Signup error:', err);
    res.status(500).send(' An error occurred during signup.');
  }
});

// Serve Signin Page
app.get('/signin', (req, res) => {
  res.sendFile(path.join(__dirname, 'signin.html'));
});

// Handle Signin Request
app.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send('Email and password are required.');
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send(' User not found. Please sign up first.');
    }

    if (user.password !== password) {
      return res.status(401).send(' Incorrect password.');
    }

    console.log(' User signed in successfully');
    res.send(' Sign-in successful!');
  } catch (err) {
    console.error(' Sign-in error:', err);
    res.status(500).send(' An error occurred during sign-in.');
  }
});

// Start Server
app.listen(port, () => {
  console.log(` Server started on http://localhost:${port}`);
});
