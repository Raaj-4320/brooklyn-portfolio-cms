import React, { useState } from 'react';
import { useContent } from '../context/ContentContext';
import { EditableText } from './ui/Editable';
import { Mail, Phone, Globe, Globe2, Linkedin, Facebook, Link as LinkIcon, Edit } from 'lucide-react';

const Footer: React.FC = () => {
  const { content, isEditing, updateContent } = useContent();
  const [editingSocialId, setEditingSocialId] = useState<number | null>(null);
  const [tempUrl, setTempUrl] = useState('');

  const getSocialIcon = (platform: string) => {
    switch(platform) {
      case 'linkedin': return <Linkedin size={16} />;
      case 'facebook': return <Facebook size={16} />;
      default: return <Globe2 size={16} />;
    }
  };

  const handleSocialClick = (e: React.MouseEvent, social: any) => {
    if (isEditing) {
      e.preventDefault();
      setEditingSocialId(social.id);
      setTempUrl(social.url);
    }
  };

  const saveSocialUrl = (index: number) => {
    updateContent('footer', ['socials', index, 'url'], tempUrl);
    setEditingSocialId(null);
  };

  return (
    <footer className="bg-white border-t border-gray-100 py-8">
      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        
        <div className="flex flex-col md:flex-row gap-6 md:gap-10 text-gray-600 text-sm">
          <div className="flex items-center gap-2">
            <Mail size={16} className="text-orange-500" />
            <EditableText section="hero" path="contactEmail" value={content.hero.contactEmail} />
          </div>
          <div className="flex items-center gap-2">
            <Phone size={16} className="text-orange-500" />
            <EditableText section="hero" path="contactPhone" value={content.hero.contactPhone} />
          </div>
          <div className="flex items-center gap-2">
            <Globe size={16} className="text-orange-500" />
            <EditableText section="hero" path="website" value={content.hero.website} />
          </div>
        </div>

        <div className="flex items-center gap-4">
          {content.footer.socials.map((social, index) => (
             <div key={social.id} className="relative group">
                <a 
                  href={social.url} 
                  onClick={(e) => handleSocialClick(e, social)}
                  className={`w-8 h-8 flex items-center justify-center bg-black text-white rounded-full transition-colors ${isEditing ? 'cursor-pointer hover:bg-violet-600' : 'hover:bg-gray-800'}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {getSocialIcon(social.platform)}
                  {isEditing && <div className="absolute -top-1 -right-1 bg-violet-500 rounded-full p-0.5"><Edit size={8} /></div>}
                </a>

                {/* Inline URL Editor */}
                {editingSocialId === social.id && (
                  <div className="absolute bottom-full right-0 mb-2 bg-white p-3 rounded shadow-xl border border-gray-200 z-50 w-64">
                    <label className="text-xs font-bold text-gray-500 mb-1 block">Edit URL</label>
                    <input 
                      type="text" 
                      value={tempUrl} 
                      onChange={(e) => setTempUrl(e.target.value)}
                      className="w-full border p-1 rounded text-sm mb-2"
                    />
                    <div className="flex justify-end gap-2">
                      <button onClick={() => setEditingSocialId(null)} className="text-xs px-2 py-1 bg-gray-100 rounded">Cancel</button>
                      <button onClick={() => saveSocialUrl(index)} className="text-xs px-2 py-1 bg-violet-600 text-white rounded">Save</button>
                    </div>
                  </div>
                )}
             </div>
          ))}
        </div>

      </div>
    </footer>
  );
};

export default Footer;