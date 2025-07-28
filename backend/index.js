require('dotenv').config();

// Debug: Check if environment variables are loaded
console.log('Environment variables loaded:');
console.log('MONGO_URI:', process.env.MONGO_URI ? 'SET' : 'NOT SET');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'SET' : 'NOT SET');
console.log('PORT:', process.env.PORT || 'DEFAULT (5000)');

const express = require('express');
const mongoose = require('mongoose');
const Member = require('./member.model');
const Joi = require('joi');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./user.model');
const cors = require('cors');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 5000;

// Security: Use helmet for HTTP headers
app.use(helmet());
// Remove x-powered-by header
app.disable('x-powered-by');

// Middleware to parse JSON
app.use(express.json());
app.use(cors());

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Simple test route
app.get('/', (req, res) => {
  res.send('Church Management System backend is running!');
});

// JWT authentication middleware
function authenticateToken(req, res, next) {
  console.log('Authentication middleware called for:', req.method, req.path);
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    console.log('No token provided for:', req.method, req.path);
    return res.status(401).json({ error: 'No token provided' });
  }
  jwt.verify(token, process.env.JWT_SECRET || 'secretkey', (err, user) => {
    if (err) {
      console.log('Invalid token for:', req.method, req.path);
      return res.status(403).json({ error: 'Invalid token' });
    }
    console.log('Token verified for user:', user.email, 'role:', user.role);
    req.user = user;
    next();
  });
}

// PUBLIC ROUTES (no authentication required)
// Add a new member (public registration)
app.post('/members', async (req, res) => {
  console.log('Public POST /members route hit - no authentication required');
  console.log('Request body:', req.body);
  
  // Joi validation schema
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().optional(),
    dateOfBirth: Joi.string().optional(),
    gender: Joi.string().optional(),
    address: Joi.string().optional(),
    city: Joi.string().optional(),
    state: Joi.string().optional(),
    zipCode: Joi.string().optional(),
    country: Joi.string().optional(),
    baptismStatus: Joi.string().optional(),
    baptismDate: Joi.string().optional(),
    previousChurch: Joi.string().optional(),
    ministryInterests: Joi.string().optional(),
    emergencyContact: Joi.string().optional(),
    emergencyPhone: Joi.string().optional(),
    occupation: Joi.string().optional(),
    maritalStatus: Joi.string().optional(),
    spouseName: Joi.string().optional(),
    children: Joi.string().optional(),
    howDidYouHear: Joi.string().optional(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    console.log('Validation error:', error.details[0].message);
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    // Always trim and lowercase the email
    const email = req.body.email.trim().toLowerCase();
    console.log('Creating member with email:', email);
    const member = new Member({ ...req.body, email });
    await member.save();
    console.log('Member created successfully:', member._id);
    res.status(201).json(member);
  } catch (err) {
    console.log('Error creating member:', err.message);
    if (err.code === 11000) {
      res.status(400).json({ error: 'Email already exists' });
    } else {
      res.status(400).json({ error: err.message });
    }
  }
});

// Public route to get all members (for frontend display)
app.get('/api/members', async (req, res) => {
  try {
    const members = await Member.find();
    res.json(members);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch members' });
  }
});

// Registration endpoint
app.post('/auth/register', async (req, res) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('admin', 'member', 'pastor', 'youth', 'choir', 'praise_and_worship').default('member'),
  });
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const { email, password, role } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'Email already registered' });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword, role });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login endpoint
app.post('/auth/login', async (req, res) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid email or password' });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ error: 'Invalid email or password' });
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'secretkey',
      { expiresIn: '1d' }
    );
    res.json({ token, role: user.role });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

console.log('Public routes registered before authentication middleware');

// PROTECTED ROUTES (authentication required)
// Protect all /members routes (except the public POST /members above)
console.log('Registering authentication middleware for /members routes');
app.use('/members', authenticateToken);

// Get a single member by ID
app.get('/members/:id', async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) return res.status(404).json({ error: 'Member not found' });
    res.json(member);
  } catch (err) {
    res.status(400).json({ error: 'Invalid member ID' });
  }
});

// Update a member by ID
app.patch('/members/:id', async (req, res) => {
  // Joi validation schema for partial updates
  const schema = Joi.object({
    name: Joi.string().optional(),
    email: Joi.string().email().optional(),
    phone: Joi.string().pattern(/^\+254\d{9}$/).message('Phone must be in Kenyan format +254XXXXXXXXX').optional(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const member = await Member.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!member) return res.status(404).json({ error: 'Member not found' });
    res.json(member);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a member by ID
app.delete('/members/:id', async (req, res) => {
  try {
    const member = await Member.findByIdAndDelete(req.params.id);
    if (!member) return res.status(404).json({ error: 'Member not found' });
    res.json({ message: 'Member deleted' });
  } catch (err) {
    res.status(400).json({ error: 'Invalid member ID' });
  }
});

// Get all members (protected)
app.get('/members', async (req, res) => {
  try {
    const members = await Member.find();
    res.json(members);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
