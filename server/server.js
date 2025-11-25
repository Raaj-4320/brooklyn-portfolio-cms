import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import Content from './models/Content.js';
import User from './models/User.js';
import Inquiry from './models/Inquiry.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
// Use Environment Variable for MongoDB, fallback to local
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/brooklyn_portfolio';
const JWT_SECRET = process.env.JWT_SECRET || 'secret_key_123';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


CLOUD_NAME=dvu9b0y9m
CLOUD_API_KEY=927423134832233
CLOUD_API_SECRET=m1jojC8UQoy0d1u5X-UfJgms-MQ


cloudinary.config({
  cloud_name: process.env.CLOUD_NAME || "dvu9b0y9m",
  api_key: process.env.CLOUD_API_KEY || "927423134832233",
  api_secret: process.env.CLOUD_API_SECRET || "m1jojC8UQoy0d1u5X-UfJgms-MQ",
});


const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'portfolio-cms',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
  },
});

const upload = multer({ storage: storage });

// --- Middleware ---
app.use(cors({
  origin: true, // Allow all origins (Netlify, Localhost, etc.)
  credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Auth Middleware
const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) throw new Error('User not found');
      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB Connected');
  } catch (err) {
    console.error('❌ DB Connection Error:', err.message);
    setTimeout(connectDB, 5000);
  }
};
connectDB();

// --- Default Template ---
const defaultContentTemplate = {
  theme: { primaryColor: '#000000', font: 'Inter' },
  seo: { metaTitle: "My Portfolio", metaDescription: "Welcome to my portfolio", ogImage: "" },
  analytics: { totalViews: 0 },
  header: { 
    logo: "MyBrand", 
    logoType: 'text', 
    links: ["Home", "About", "Services", "Portfolio", "Blog"], 
    cta: "Contact" 
  },
  hero: { 
    badge: "Welcome", 
    titleLine1: "I'm a Creator", 
    titleLine2: "Digital Designer", 
    subtitle: "This is your new portfolio. Edit this text in the Admin Panel to tell your story.", 
    ctaText: "Download Resume", 
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800", 
    contactEmail: "email@example.com", 
    contactPhone: "+1 234 567 890", 
    website: "www.mysite.com" 
  },
  about: { 
    greeting: "Hello, I'm", 
    name: "Your Name", 
    prefix: "I'm a Freelance", 
    role1: "Designer", 
    role2: "Developer", 
    suffix: "based in New York.", 
    description: "Passionate about building great digital experiences. Edit this section to describe your background and skills.", 
    buttonText: "Say Hello!", 
    stats: { experience: "5 Y.", projects: "100+", clients: "20" }, 
    statsLabels: { experience: "Experience", projects: "Projects Completed", clients: "Happy Clients" }, 
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800" 
  },
  services: { 
    badge: "my services", 
    title: "What I can do", 
    subtitle: "for your business", 
    buttonText: "Get Started", 
    cards: [
      { id: 1, title: "UI/UX Design", description: "Creating intuitive and beautiful user interfaces.", iconType: "layout" },
      { id: 2, title: "Web Development", description: "Building responsive and fast websites.", iconType: "layers" },
      { id: 3, title: "Consulting", description: "Helping you make the right tech decisions.", iconType: "settings" }
    ] 
  },
  blog: { 
    title: "Latest News", 
    subtitle: "Thoughts on technology and design.", 
    commentsLabel: "Comments", 
    posts: [
      { id: 1, image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=600", date: "Oct 22, 2023", comments: 5, title: "Welcome to my new blog", body: "<p>This is a sample post. You can edit it in the admin panel.</p>" }
    ] 
  },
  cta: { 
    titleLine1: "Have a project?", 
    titleLine2: "Let's talk!", 
    description: "I am available for freelance work. Send me a message to get started.", 
    buttonText: "Let's work Together" 
  },
  clients: { 
    title: "Trusted By", 
    subtitle: "Companies I have worked with.", 
    logos: [
      { id: 1, src: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/2560px-Google_2015_logo.svg.png", alt: "Google" }
    ] 
  },
  footer: { 
    socials: [
      { id: 1, platform: "website", url: "https://example.com" }
    ] 
  }
};

// --- Routes ---

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// REGISTER
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, username, email, password } = req.body;
    if (await User.findOne({ email })) return res.status(400).json({ message: 'Email already exists' });
    if (await User.findOne({ username })) return res.status(400).json({ message: 'Username already taken' });

    const user = await User.create({ name, username, email, password });
    await Content.create({ ...defaultContentTemplate, owner: user._id });

    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token: jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '30d' })
    });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed' });
  }
});

// LOGIN
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token: jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '30d' })
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// UPLOAD (Cloudinary)
app.post('/api/upload', protect, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  // Cloudinary returns the URL in req.file.path
  res.json({ url: req.file.path });
});

// INQUIRY
app.post('/api/inquiry', async (req, res) => {
  try {
    const { ownerId, ...data } = req.body;
    if (!ownerId) return res.status(400).json({ success: false, message: "Recipient (Owner ID) is required" });

    await Inquiry.create({ ...data, owner: ownerId });
    res.json({ success: true, message: "Inquiry saved" });
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

// Get Inquiries
app.get('/api/inquiry', protect, async (req, res) => {
  try {
    const inquiries = await Inquiry.find({ owner: req.user._id }).sort({ createdAt: -1 });
    res.json(inquiries);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching inquiries' });
  }
});

app.delete('/api/inquiry/:id', protect, async (req, res) => {
  try {
    const inquiry = await Inquiry.findOne({ _id: req.params.id, owner: req.user._id });
    if (!inquiry) return res.status(404).json({ message: "Unauthorized" });
    await Inquiry.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting inquiry' });
  }
});

// CONTENT (Private)
app.get('/api/content', protect, async (req, res) => {
  try {
    const content = await Content.findOne({ owner: req.user._id });
    if (!content) return res.status(404).json({ message: "Content not found" });
    res.json(content);
  } catch (err) {
    res.status(500).json({ message: "Failed to load content" });
  }
});

// CONTENT (Public)
app.get('/api/portfolio/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) return res.status(404).json({ message: "User not found" });

    const content = await Content.findOne({ owner: user._id });
    if (content) Content.updateOne({ _id: content._id }, { $inc: { 'analytics.totalViews': 1 } }).exec();
    res.json(content);
  } catch (err) {
    res.status(500).json({ message: "Failed to load portfolio" });
  }
});

app.put('/api/content', protect, async (req, res) => {
  try {
    const content = await Content.findOneAndUpdate({ owner: req.user._id }, req.body, { new: true });
    res.json(content);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));