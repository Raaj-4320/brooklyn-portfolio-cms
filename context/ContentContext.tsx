import React, { createContext, useContext, useState, useEffect } from 'react';
import { ContentData, ContentContextType, Inquiry } from '../types';

// DYNAMIC URL: Uses Vite Env var in production, or localhost in development
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:5000/api';

const defaultContent: ContentData = {
  theme: { primaryColor: '#000000', font: 'Inter' },
  seo: { metaTitle: "Loading...", metaDescription: "", ogImage: "" },
  analytics: { totalViews: 0 },
  header: { logo: "...", logoType: 'text', links: [], cta: "..." },
  hero: { badge: "...", titleLine1: "Loading...", titleLine2: "", subtitle: "", ctaText: "", image: "", contactEmail: "", contactPhone: "", website: "" },
  about: { greeting: "", name: "", prefix: "", role1: "", role2: "", suffix: "", description: "", buttonText: "", stats: { experience: "", projects: "", clients: "" }, statsLabels: { experience: "", projects: "", clients: "" }, image: "" },
  services: { badge: "", title: "", subtitle: "", buttonText: "", cards: [] },
  blog: { title: "", subtitle: "", commentsLabel: "", posts: [] },
  cta: { titleLine1: "", titleLine2: "", description: "", buttonText: "" },
  clients: { title: "", subtitle: "", logos: [] },
  footer: { socials: [] }
};

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider = ({ children }: { children: React.ReactNode }) => {
  const [content, setContent] = useState<ContentData>(defaultContent);
  const [isEditing, setIsEditing] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(storedUser));
      if (window.location.pathname === '/' || window.location.pathname === '/admin') {
        loadPrivateContent(token);
      }
    }
  }, []);

  const checkServerStatus = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/health`);
      if (res.ok) {
        return true;
      }
    } catch (e) {
      return false;
    }
    return false;
  };

  const loadPrivateContent = async (token: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/content`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setContent(data);
        if (data.seo?.metaTitle) document.title = data.seo.metaTitle;
      }
    } catch (e) { console.error("Load Private Error", e); }
  };

  const loadPublicContent = async (username: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/portfolio/${username}`);
      if (res.ok) {
        const data = await res.json();
        setContent(data);
        if (data.seo?.metaTitle) document.title = data.seo.metaTitle;
        return true;
      }
    } catch (e) { console.error("Load Public Error", e); }
    return false;
  };

  const login = async (password: string, email?: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify({ name: data.name, username: data.username, email: data.email }));
        setIsAuthenticated(true);
        setUser(data);
        loadPrivateContent(data.token);
        return true;
      } else {
        const err = await response.json();
        alert(err.message);
      }
    } catch (e) { alert("Connection error. Server may be sleeping (Free Tier). Please wait 30s and try again."); }
    return false;
  };

  const register = async (userData: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify({ name: data.name, username: data.username, email: data.email }));
        setIsAuthenticated(true);
        setUser(data);
        loadPrivateContent(data.token);
        return true;
      } else {
        const err = await response.json();
        alert(err.message);
      }
    } catch (e) { alert("Connection error. Server may be sleeping (Free Tier). Please wait 30s and try again."); }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setIsEditing(false);
    setUser(null);
    window.location.href = '/admin';
  };

  const fetchInquiries = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE_URL}/inquiry`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) setInquiries(await res.json());
    } catch (e) { console.warn("Fetch inquiries failed"); }
  };

  const deleteInquiry = async (id: string) => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      await fetch(`${API_BASE_URL}/inquiry/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      setInquiries(prev => prev.filter(i => i._id !== id));
    } catch (e) { console.error("Delete failed", e); }
  };

  const updateContent = (section: keyof ContentData, path: string | (string | number)[], value: any) => {
    setContent(prev => {
      const deepClone = JSON.parse(JSON.stringify(prev));
      let current = deepClone[section];
      const pathArray = Array.isArray(path) ? path : [path];
      for (let i = 0; i < pathArray.length - 1; i++) current = current[pathArray[i]];
      current[pathArray[pathArray.length - 1]] = value;
      return deepClone;
    });
  };

  const saveContent = async () => {
    const token = localStorage.getItem('token');
    if (!token) { 
       alert("You are not logged in."); 
       return; 
    }
    try {
      const res = await fetch(`${API_BASE_URL}/content`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(content)
      });
      if (!res.ok) throw new Error("Failed to save");
    } catch (e) {
      console.warn("Server save failed.");
    }
  };

  const toggleEditing = () => setIsEditing(!isEditing);
  const openContactModal = () => setIsContactModalOpen(true);
  const closeContactModal = () => setIsContactModalOpen(false);

  return (
    <ContentContext.Provider value={{ 
      content, updateContent, isEditing, toggleEditing, saveContent,
      isAuthenticated, user, login, register, logout, inquiries, fetchInquiries, deleteInquiry,
      isContactModalOpen, openContactModal, closeContactModal, loadPublicContent
    }}>
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => {
  const context = useContext(ContentContext);
  if (!context) throw new Error('useContent error');
  return context;
};