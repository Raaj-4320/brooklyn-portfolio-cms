import React, { useState } from 'react';
import { useContent } from '../context/ContentContext';
import { EditableText } from './ui/Editable';
import { Menu, X } from 'lucide-react';

const Header: React.FC = () => {
  const { content, isEditing, openContactModal } = useContent();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNavClick = (linkName: string) => {
    if (isEditing) return;
    
    if (linkName.toLowerCase() === 'contact') {
      openContactModal();
      setIsMenuOpen(false);
      return;
    }
    
    // Normalize link name to ID mapping
    const idMap: Record<string, string> = {
      'Home': 'home',
      'About': 'about',
      'Process': 'services',
      'Portfolio': 'portfolio',
      'Blog': 'blog',
      'Services': 'services',
      'Contact': 'contact'
    };
    
    const id = idMap[linkName] || linkName.toLowerCase().replace(/\s+/g, '-');
    const element = document.getElementById(id);
    
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    } else if (id === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  const handleCtaClick = () => {
    if (isEditing) return;
    openContactModal();
    setIsMenuOpen(false);
  };
  
  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm border-b border-gray-100 py-4">
      <div className="container mx-auto px-6 flex items-center gap-8 md:gap-12">
        <div className="flex items-center gap-2 cursor-pointer flex-shrink-0" onClick={() => handleNavClick('Home')}>
          {content.header.logoType === 'image' ? (
             <img 
               src={content.header.logo} 
               alt="Logo" 
               className="h-10 w-auto object-contain" 
             />
          ) : (
            <>
              <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white font-bold text-xl">
                {content.header.logo.charAt(0)}
              </div>
              <EditableText 
                section="header" 
                path="logo" 
                value={content.header.logo} 
                className="text-2xl font-bold text-gray-900 tracking-tight"
              />
            </>
          )}
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {content.header.links.map((link, index) => (
            <div 
              key={index} 
              onClick={() => handleNavClick(link)}
              className={`font-medium transition-colors text-sm uppercase tracking-wide ${isEditing ? 'cursor-text' : 'cursor-pointer text-gray-500 hover:text-black'}`}
            >
               <EditableText 
                  section="header"
                  path={['links', index]}
                  value={link}
               />
            </div>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center ml-auto md:ml-0">
          <button 
            onClick={handleCtaClick}
            className={`bg-black text-white px-6 py-2.5 rounded-md font-semibold shadow-lg transition-colors ${isEditing ? '' : 'hover:bg-gray-800'}`}
          >
            <EditableText 
              section="header" 
              path="cta" 
              value={content.header.cta} 
              as="span"
            />
          </button>
        </div>

        <div className="flex-grow md:hidden"></div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden p-2 text-gray-600 hover:text-black focus:outline-none ml-auto"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-t border-gray-100 shadow-lg p-6 flex flex-col gap-4 animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col gap-4">
            {content.header.links.map((link, index) => (
               <div 
                  key={index} 
                  className="py-2 border-b border-gray-50 last:border-0"
                  onClick={() => handleNavClick(link)}
                >
                 <EditableText 
                    section="header"
                    path={['links', index]}
                    value={link}
                    className={`font-medium block text-lg ${isEditing ? '' : 'text-gray-600 active:text-black'}`}
                 />
               </div>
            ))}
          </nav>
          <div className="pt-2">
             <button 
                onClick={handleCtaClick}
                className="w-full bg-black text-white px-6 py-3 rounded-md font-semibold hover:bg-gray-800 transition-colors shadow-lg"
              >
              <EditableText 
                section="header" 
                path="cta" 
                value={content.header.cta} 
                as="span"
              />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;