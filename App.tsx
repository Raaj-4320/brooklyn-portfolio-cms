import React, { useEffect } from 'react';
import { ContentProvider, useContent } from './context/ContentContext';
import Header from './components/Header';
// import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Blog from './components/Blog';
import CTA from './components/CTA';
import Clients from './components/Clients';
import Footer from './components/Footer';
import { AdminPanel } from './components/AdminPanel';
import { Login } from './components/Login';
import { InquiryModal } from './components/InquiryModal';
import { PenTool } from 'lucide-react';
import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom';

const ThemeInjector = () => {
  // Hardcoded Black Theme
  return (
    <style>{`
      .text-violet-600 { color: #000 !important; }
      .bg-violet-600 { background-color: #000 !important; }
      .bg-violet-50 { background-color: #f9f9f9 !important; }
      /* ... (Full black theme CSS) ... */
    `}</style>
  );
};

const LiveSite = () => {
  const { isEditing, toggleEditing, isAuthenticated } = useContent();
  return (
    <div className={`min-h-screen flex flex-col ${isEditing ? 'ring-4 ring-gray-900/30' : ''}`} style={{ fontFamily: 'Inter' }}>
       <ThemeInjector />
       <InquiryModal />
       {isAuthenticated && (
         <button onClick={toggleEditing} className={`fixed bottom-8 left-8 z-50 p-3 rounded-full shadow-lg transition-all ${isEditing ? 'bg-green-500 text-white' : 'bg-white text-black hover:bg-gray-100'}`}>
          <PenTool size={20} />
         </button>
       )}
      <Header />
      <main className="flex-grow">
        <About />
        {/* <Hero /> */}
        <Services />
        <Blog />
        <CTA />
        <Clients />
      </main>
      <Footer />
    </div>
  );
};

// Component to load ANY user's portfolio based on URL
const PublicPortfolio = () => {
  const { username } = useParams();
  const { loadPublicContent } = useContent();
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);

  useEffect(() => {
    if (username) {
      loadPublicContent(username).then(success => {
        if (!success) setError(true);
        setLoading(false);
      });
    }
  }, [username]);

  if (loading) return <div className="h-screen flex items-center justify-center">Loading Portfolio...</div>;
  if (error) return <div className="h-screen flex items-center justify-center">User not found</div>;

  return <LiveSite />;
};

const ProtectedAdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useContent();
  const hasToken = !!localStorage.getItem('token');
  if (!isAuthenticated && !hasToken) return <Navigate to="/admin/login" replace />;
  return <>{children}</>;
};

const AppContent = () => {
  return (
    <Routes>
      {/* Logged In User's View */}
      <Route path="/" element={<LiveSite />} />
      
      {/* Public View for ANY User */}
      <Route path="/p/:username" element={<PublicPortfolio />} />

      <Route path="/admin" element={<ProtectedAdminRoute><AdminPanel /></ProtectedAdminRoute>} />
      <Route path="/admin/login" element={<Login />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ContentProvider>
        <AppContent />
      </ContentProvider>
    </BrowserRouter>
  );
};

export default App;