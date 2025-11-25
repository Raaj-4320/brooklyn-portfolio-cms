import mongoose from 'mongoose';

const ContentSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false }, // Links content to a user
  theme: {
    primaryColor: { type: String, default: 'violet' },
    font: { type: String, default: 'Inter' }
  },
  seo: {
    metaTitle: { type: String, default: 'Brooklyn - Portfolio' },
    metaDescription: { type: String, default: 'Freelance UI/UX Designer Portfolio' },
    ogImage: { type: String, default: '' }
  },
  analytics: {
    totalViews: { type: Number, default: 0 }
  },
  header: {
    logo: String,
    logoType: { type: String, default: 'text' },
    links: [String],
    cta: String
  },
  hero: {
    badge: String,
    titleLine1: String,
    titleLine2: String,
    subtitle: String,
    ctaText: String,
    image: String,
    contactEmail: String,
    contactPhone: String,
    website: String
  },
  about: {
    greeting: String,
    name: String,
    prefix: String,
    role1: String,
    role2: String,
    suffix: String,
    description: String,
    buttonText: String,
    stats: {
      experience: String,
      projects: String,
      clients: String
    },
    statsLabels: {
      experience: String,
      projects: String,
      clients: String
    },
    image: String
  },
  services: {
    badge: String,
    title: String,
    subtitle: String,
    buttonText: String,
    cards: [{
      id: Number,
      title: String,
      description: String,
      iconType: String
    }]
  },
  blog: {
    title: String,
    subtitle: String,
    commentsLabel: String,
    posts: [{
      id: Number,
      image: String,
      date: String,
      comments: Number,
      title: String,
      body: String
    }]
  },
  cta: {
    titleLine1: String,
    titleLine2: String,
    description: String,
    buttonText: String
  },
  clients: {
    title: String,
    subtitle: String,
    logos: [{
      id: Number,
      src: String,
      alt: String
    }]
  },
  footer: {
    socials: [{
      id: Number,
      platform: String,
      url: String
    }]
  }
}, { timestamps: true });

export default mongoose.model('Content', ContentSchema);