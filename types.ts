export interface ContentData {
  _id?: string;
  owner?: string; // Added owner ID to match multi-user architecture
  theme: {
    primaryColor: string;
    font: string;
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
    ogImage: string;
  };
  analytics: {
    totalViews: number;
  };
  header: {
    logo: string;
    logoType: 'text' | 'image';
    links: string[];
    cta: string;
  };
  hero: {
    badge: string;
    titleLine1: string;
    titleLine2: string;
    subtitle: string;
    ctaText: string;
    image: string;
    contactEmail: string;
    contactPhone: string;
    website: string;
  };
  about: {
    greeting: string;
    name: string;
    prefix: string;
    role1: string;
    role2: string;
    suffix: string;
    description: string;
    buttonText: string;
    stats: {
      experience: string;
      projects: string;
      clients: string;
    };
    statsLabels: {
      experience: string;
      projects: string;
      clients: string;
    };
    image: string;
  };
  services: {
    badge: string;
    title: string;
    subtitle: string;
    buttonText: string;
    cards: Array<{
      id: number;
      title: string;
      description: string;
      iconType: 'layout' | 'settings' | 'layers';
    }>;
  };
  blog: {
    title: string;
    subtitle: string;
    commentsLabel: string;
    posts: Array<{
      id: number;
      image: string;
      date: string;
      comments: number;
      title: string;
      body: string;
    }>;
  };
  cta: {
    titleLine1: string;
    titleLine2: string;
    description: string;
    buttonText: string;
  };
  clients: {
    title: string;
    subtitle: string;
    logos: Array<{
      id: number;
      src: string;
      alt: string;
    }>;
  };
  footer: {
    socials: Array<{
      id: number;
      platform: 'website' | 'linkedin' | 'facebook' | 'twitter' | 'instagram';
      url: string;
    }>;
  };
}

export interface Inquiry {
  _id: string;
  owner?: string; // Added owner
  email: string;
  phone: string;
  country: string;
  category: string;
  productName: string;
  productDetails: string;
  description: string;
  createdAt: string;
}

export interface ContentContextType {
  content: ContentData;
  updateContent: (section: keyof ContentData, path: string | (string | number)[], value: any) => void;
  isEditing: boolean;
  toggleEditing: () => void;
  saveContent: () => Promise<void>;
  isAuthenticated: boolean;
  user: any; // Added user object
  
  // FIX: Updated signature to accept email
  login: (password: string, email?: string) => Promise<boolean>; 
  register: (userData: any) => Promise<boolean>; // Added register
  
  logout: () => void;
  inquiries: Inquiry[];
  fetchInquiries: () => Promise<void>;
  deleteInquiry: (id: string) => Promise<void>;
  
  // Modal State
  isContactModalOpen: boolean;
  openContactModal: () => void;
  closeContactModal: () => void;
  
  // Public Loader
  loadPublicContent: (username: string) => Promise<boolean>;
}