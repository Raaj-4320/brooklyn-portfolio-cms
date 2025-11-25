import React, { useState, useEffect } from 'react';
import { useContent, API_BASE_URL } from '../context/ContentContext';
import { 
  LayoutDashboard, Type, Image as ImageIcon, List, MessageSquare, 
  Users, Settings, Plus, Trash2, ExternalLink, Menu, X, Upload, 
  Link, Loader2, Save, Check, Wifi, WifiOff, Mail, Globe, 
  BarChart3, LogOut, Sparkles
} from 'lucide-react';
import { rewriteText } from '../services/gemini';

const SidebarItem = ({ icon: Icon, label, active, onClick }: any) => (
  <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors rounded-lg mb-1 ${active ? 'bg-black text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}>
    <Icon size={18} />{label}
  </button>
);

const InputGroup = ({ label, children, description }: any) => (
  <div className="mb-6 bg-white p-4 md:p-6 rounded-xl border border-gray-100 shadow-sm">
    <label className="block text-sm font-bold text-gray-900 mb-1">{label}</label>
    {description && <p className="text-xs text-gray-500 mb-4">{description}</p>}
    <div className="space-y-4">{children}</div>
  </div>
);

const TextInput = ({ label, value, onChange, multiline = false, rows = 3 }: any) => {
  const [localValue, setLocalValue] = useState(value || '');
  useEffect(() => { setLocalValue(value || ''); }, [value]);
  const handleBlur = () => { if (localValue !== value) onChange(localValue); };
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">{label}</label>
      {multiline ? (
        <textarea value={localValue} onChange={(e) => setLocalValue(e.target.value)} onBlur={handleBlur} rows={rows} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-base md:text-sm text-gray-900 focus:ring-2 focus:ring-black outline-none min-h-[100px]" />
      ) : (
        <input type="text" value={localValue} onChange={(e) => setLocalValue(e.target.value)} onBlur={handleBlur} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-base md:text-sm text-gray-900 focus:ring-2 focus:ring-black outline-none" />
      )}
    </div>
  );
};

const ImageInput = ({ label, value, onChange }: any) => {
  const [activeTab, setActiveTab] = useState<'url' | 'upload'>('url');
  const [uploading, setUploading] = useState(false);
  const [localUrl, setLocalUrl] = useState(value || '');
  
  useEffect(() => { setLocalUrl(value || ''); }, [value]);
  
  const handleUrlBlur = () => { if (localUrl !== value) onChange(localUrl); };
  
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/upload`, { 
        method: 'POST', body: formData, headers: { 'Authorization': `Bearer ${token}` } 
      });
      if (!response.ok) throw new Error('Upload failed');
      const data = await response.json();
      onChange(data.url); setLocalUrl(data.url);
    } catch (error) {
      console.warn("Backend upload failed, falling back to local preview.");
      const tempUrl = URL.createObjectURL(file);
      onChange(tempUrl); setLocalUrl(tempUrl);
    } finally { setUploading(false); }
  };

  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">{label}</label>
      <div className="flex gap-2 mb-2">
        <button onClick={() => setActiveTab('url')} className={`text-xs px-3 py-1.5 rounded-full ${activeTab === 'url' ? 'bg-gray-100 text-black font-bold' : 'text-gray-500'}`}>Link</button>
        <button onClick={() => setActiveTab('upload')} className={`text-xs px-3 py-1.5 rounded-full ${activeTab === 'upload' ? 'bg-gray-100 text-black font-bold' : 'text-gray-500'}`}>Upload</button>
      </div>
      <div className="flex flex-col sm:flex-row gap-4 items-start">
        <div className="flex-grow w-full">
          {activeTab === 'url' ? (
            <input type="text" value={localUrl} onChange={(e) => setLocalUrl(e.target.value)} onBlur={handleUrlBlur} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm" placeholder="https://..." />
          ) : (
             <div className="w-full p-3 bg-gray-50 border border-dashed border-gray-300 rounded-lg text-center relative">
               <input type="file" accept="image/*" onChange={handleFileUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
               <div className="text-gray-500">{uploading ? <Loader2 className="animate-spin mx-auto"/> : <Upload className="mx-auto"/>}</div>
             </div>
          )}
        </div>
        <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden border">{value && <img src={value} className="w-full h-full object-cover" />}</div>
      </div>
    </div>
  );
};

const SaveButton = () => {
  const { saveContent } = useContent();
  const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  
  const handleClick = async () => {
    setStatus('saving');
    try { await saveContent(); setStatus('success'); setTimeout(() => setStatus('idle'), 2000); } 
    catch (e) { setStatus('error'); setTimeout(() => setStatus('idle'), 3000); }
  };
  
  return (
    <div className="fixed bottom-0 left-0 right-0 md:relative z-40 p-4 bg-white border-t md:border-0 md:bg-transparent">
       <button onClick={handleClick} disabled={status === 'saving'} className={`w-full md:w-auto flex justify-center items-center gap-2 px-6 py-3 rounded-lg font-bold shadow-lg transition-all ${status === 'success' ? 'bg-green-500 text-white' : status === 'error' ? 'bg-red-500 text-white' : 'bg-black text-white'}`}>
          {status === 'saving' ? <Loader2 className="animate-spin" /> : status === 'success' ? <Check /> : <Save />} {status === 'saving' ? 'Saving...' : 'Save Changes'}
       </button>
    </div>
  );
};

export const AdminPanel: React.FC = () => {
  const { content, updateContent, logout, inquiries, fetchInquiries, deleteInquiry } = useContent();
  const [activeTab, setActiveTab] = useState('inbox');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (activeTab === 'inbox') fetchInquiries();
  }, [activeTab]);

  const tabs = [
    { id: 'inbox', label: 'Inbox & Messages', icon: Mail },
    { id: 'header', label: 'Header & Nav', icon: LayoutDashboard },
    { id: 'about', label: 'About Section', icon: Users },
    { id: 'hero', label: 'Hero Section', icon: Type },
    { id: 'services', label: 'Services', icon: Settings },
    { id: 'blog', label: 'Blog Posts', icon: MessageSquare },
    { id: 'clients', label: 'Clients & Logos', icon: List },
    { id: 'cta', label: 'Call to Action', icon: ExternalLink },
    { id: 'footer', label: 'Footer', icon: LayoutDashboard },
    { id: 'seo', label: 'SEO & Metadata', icon: Globe },
  ];

  const handleArrayAdd = (section: any, arrayKey: string, newItem: any) => {
    // @ts-ignore
    updateContent(section, arrayKey, [...(content[section][arrayKey] || []), newItem]);
  };
  const handleArrayRemove = (section: any, arrayKey: string, index: number) => {
    // @ts-ignore
    const arr = [...content[section][arrayKey]]; arr.splice(index, 1); updateContent(section, arrayKey, arr);
  };

  const generateBlogPost = async (index: number, title: string) => {
    setGenerating(true);
    const prompt = `Write a professional, 3-paragraph blog post about "${title}" for a UI/UX designer. Use HTML formatting (<p>, <strong>) but no markdown blocks.`;
    const body = await rewriteText(prompt, 'professional');
    updateContent('blog', ['posts', index, 'body'], body);
    setGenerating(false);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'inbox':
        return (
           <div className="space-y-6">
             <div className="flex justify-between items-center">
               <h2 className="text-2xl font-bold text-gray-900">Inbox</h2>

             </div>
             {inquiries.length === 0 ? <p className="text-gray-500">No messages yet.</p> : (
               <div className="grid gap-4">
                 {inquiries.map(inq => (
                   <div key={inq._id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-bold text-lg">{inq.productName} <span className="text-sm font-normal text-gray-500">({inq.category})</span></h3>
                          <p className="text-sm text-gray-600 font-medium">{inq.email} • {inq.phone}</p>
                        </div>
                        <button onClick={() => deleteInquiry(inq._id)} className="text-red-400 hover:text-red-600"><Trash2 size={18}/></button>
                      </div>
                      <p className="text-gray-700 text-sm mt-2 whitespace-pre-wrap">{inq.description}</p>
                      <p className="text-xs text-gray-400 mt-3">{new Date(inq.createdAt).toLocaleDateString()}</p>
                   </div>
                 ))}
               </div>
             )}
           </div>
        );
      case 'seo':
         return (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">SEO</h2>
              <InputGroup label="Metadata">
                <TextInput label="Meta Title" value={content.seo.metaTitle} onChange={(v: any) => updateContent('seo', 'metaTitle', v)} />
                <TextInput label="Meta Description" value={content.seo.metaDescription} onChange={(v: any) => updateContent('seo', 'metaDescription', v)} multiline />
                <ImageInput label="Social Share Image (OG)" value={content.seo.ogImage} onChange={(v: any) => updateContent('seo', 'ogImage', v)} />
              </InputGroup>
              <SaveButton />
            </div>
         );
      case 'blog':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Blog Posts</h2>
             <div className="space-y-4">
                {content.blog.posts.map((post, i) => (
                  <div key={post.id} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                     <TextInput label="Title" value={post.title} onChange={(v: string) => updateContent('blog', ['posts', i, 'title'], v)} />
                     <div className="mt-4">
                        <label className="flex justify-between text-xs font-semibold text-gray-500 uppercase mb-1.5">
                           Article Body
                           <button 
                            onClick={() => generateBlogPost(i, post.title)}
                            disabled={generating}
                            className="flex items-center gap-1 text-violet-600 hover:text-violet-800"
                           >
                              <Sparkles size={12}/> {generating ? 'Writing...' : 'Write with AI'}
                           </button>
                        </label>
                        <TextInput label="" value={post.body || ''} onChange={(v: string) => updateContent('blog', ['posts', i, 'body'], v)} multiline rows={8} />
                     </div>
                  </div>
                ))}
                <button onClick={() => handleArrayAdd('blog', 'posts', { id: Date.now(), title: 'New', date: new Date().toLocaleDateString(), comments: 0, image: '', body: '' })} className="flex items-center gap-2 text-sm font-bold text-black"><Plus size={16}/> Add Post</button>
              </div>
            <SaveButton />
          </div>
        );
      case 'header':
        return (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Header</h2>
              <InputGroup label="Logo Settings">
                 <div className="flex gap-4 mb-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="logoType" checked={content.header.logoType === 'text'} onChange={() => updateContent('header', 'logoType', 'text')} />
                      <span className="text-sm font-medium">Text Logo</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="logoType" checked={content.header.logoType === 'image'} onChange={() => updateContent('header', 'logoType', 'image')} />
                      <span className="text-sm font-medium">Image Logo</span>
                    </label>
                 </div>
                 {content.header.logoType === 'text' ? (
                    <TextInput label="Logo Text" value={content.header.logo} onChange={(v: any) => updateContent('header', 'logo', v)} />
                 ) : (
                    <ImageInput label="Logo Image" value={content.header.logo} onChange={(v: any) => updateContent('header', 'logo', v)} />
                 )}
                 <div className="mt-4">
                    <TextInput label="CTA Button Text" value={content.header.cta} onChange={(v: any) => updateContent('header', 'cta', v)} />
                 </div>
              </InputGroup>
              <InputGroup label="Navigation Links">
                 {content.header.links.map((link, i) => (
                    <div key={i} className="flex gap-2 mb-2">
                       <TextInput label="" value={link} onChange={(v: any) => updateContent('header', ['links', i], v)} />
                       <button onClick={() => handleArrayRemove('header', 'links', i)} className="text-red-400 hover:text-red-600 p-2 mt-1"><Trash2 size={18}/></button>
                    </div>
                 ))}
                 <button onClick={() => handleArrayAdd('header', 'links', "New Link")} className="text-sm text-black font-bold flex items-center gap-1 mt-2"><Plus size={16}/> Add Link</button>
              </InputGroup>
              <SaveButton />
            </div>
        );
      case 'about':
         return (
            <div className="space-y-6">
               <h2 className="text-2xl font-bold text-gray-900">About Section</h2>
               <InputGroup label="Personal Info">
                  <TextInput label="Greeting" value={content.about.greeting} onChange={(v: any) => updateContent('about', 'greeting', v)} />
                  <TextInput label="Name" value={content.about.name} onChange={(v: any) => updateContent('about', 'name', v)} />
                  <TextInput label="Prefix (I'm a...)" value={content.about.prefix} onChange={(v: any) => updateContent('about', 'prefix', v)} />
                  <div className="grid grid-cols-2 gap-4">
                    <TextInput label="Role 1" value={content.about.role1} onChange={(v: any) => updateContent('about', 'role1', v)} />
                    <TextInput label="Role 2" value={content.about.role2} onChange={(v: any) => updateContent('about', 'role2', v)} />
                  </div>
                  <TextInput label="Suffix" value={content.about.suffix} onChange={(v: any) => updateContent('about', 'suffix', v)} />
                  <TextInput label="Description" value={content.about.description} onChange={(v: any) => updateContent('about', 'description', v)} multiline />
                  <ImageInput label="Profile Image" value={content.about.image} onChange={(v: any) => updateContent('about', 'image', v)} />
               </InputGroup>
               <InputGroup label="Stats">
                 <div className="grid grid-cols-2 gap-4 mb-4">
                    <TextInput label="Exp Value" value={content.about.stats.experience} onChange={(v: any) => updateContent('about', ['stats', 'experience'], v)} />
                    <TextInput label="Exp Label" value={content.about.statsLabels.experience} onChange={(v: any) => updateContent('about', ['statsLabels', 'experience'], v)} />
                 </div>
                 <div className="grid grid-cols-2 gap-4 mb-4">
                    <TextInput label="Projects Value" value={content.about.stats.projects} onChange={(v: any) => updateContent('about', ['stats', 'projects'], v)} />
                    <TextInput label="Projects Label" value={content.about.statsLabels.projects} onChange={(v: any) => updateContent('about', ['statsLabels', 'projects'], v)} />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <TextInput label="Clients Value" value={content.about.stats.clients} onChange={(v: any) => updateContent('about', ['stats', 'clients'], v)} />
                    <TextInput label="Clients Label" value={content.about.statsLabels.clients} onChange={(v: any) => updateContent('about', ['statsLabels', 'clients'], v)} />
                 </div>
               </InputGroup>
               <SaveButton />
            </div>
         );
      case 'hero':
        return (
          <div className="space-y-6">
             <h2 className="text-2xl font-bold text-gray-900">Hero Section</h2>
             <InputGroup label="Main Text">
               <TextInput label="Badge" value={content.hero.badge} onChange={(v: any) => updateContent('hero', 'badge', v)} />
               <TextInput label="Title Line 1" value={content.hero.titleLine1} onChange={(v: any) => updateContent('hero', 'titleLine1', v)} />
               <TextInput label="Title Line 2" value={content.hero.titleLine2} onChange={(v: any) => updateContent('hero', 'titleLine2', v)} />
               <TextInput label="Subtitle" value={content.hero.subtitle} onChange={(v: any) => updateContent('hero', 'subtitle', v)} multiline />
               <TextInput label="CTA Text" value={content.hero.ctaText} onChange={(v: any) => updateContent('hero', 'ctaText', v)} />
             </InputGroup>
             <InputGroup label="Contact Info">
               <TextInput label="Email" value={content.hero.contactEmail} onChange={(v: any) => updateContent('hero', 'contactEmail', v)} />
               <TextInput label="Phone" value={content.hero.contactPhone} onChange={(v: any) => updateContent('hero', 'contactPhone', v)} />
               <TextInput label="Website" value={content.hero.website} onChange={(v: any) => updateContent('hero', 'website', v)} />
             </InputGroup>
             <InputGroup label="Visuals">
               <ImageInput label="Hero Image" value={content.hero.image} onChange={(v: any) => updateContent('hero', 'image', v)} />
             </InputGroup>
             <SaveButton />
          </div>
        );
      case 'services':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Services</h2>
            <InputGroup label="Headings">
               <TextInput label="Badge" value={content.services.badge} onChange={(v: any) => updateContent('services', 'badge', v)} />
               <TextInput label="Title" value={content.services.title} onChange={(v: any) => updateContent('services', 'title', v)} />
               <TextInput label="Subtitle" value={content.services.subtitle} onChange={(v: any) => updateContent('services', 'subtitle', v)} />
               <TextInput label="Button Text" value={content.services.buttonText} onChange={(v: any) => updateContent('services', 'buttonText', v)} />
            </InputGroup>
            <div className="space-y-4">
               {content.services.cards.map((card, i) => (
                 <div key={card.id} className="p-4 border border-gray-200 rounded-lg bg-gray-50 relative">
                   <button onClick={() => handleArrayRemove('services', 'cards', i)} className="absolute top-2 right-2 text-red-400 hover:text-red-600"><Trash2 size={16}/></button>
                   <TextInput label="Title" value={card.title} onChange={(v: any) => updateContent('services', ['cards', i, 'title'], v)} />
                   <TextInput label="Description" value={card.description} onChange={(v: any) => updateContent('services', ['cards', i, 'description'], v)} multiline />
                 </div>
               ))}
               <button onClick={() => handleArrayAdd('services', 'cards', { id: Date.now(), title: "New Service", description: "Description", iconType: 'layout' })} className="text-sm font-bold text-black flex items-center gap-1"><Plus size={16}/> Add Service</button>
            </div>
            <SaveButton />
          </div>
        );
      case 'clients':
        return (
           <div className="space-y-6">
             <h2 className="text-2xl font-bold text-gray-900">Clients</h2>
             <InputGroup label="Headings">
                <TextInput label="Title" value={content.clients.title} onChange={(v: any) => updateContent('clients', 'title', v)} />
                <TextInput label="Subtitle" value={content.clients.subtitle} onChange={(v: any) => updateContent('clients', 'subtitle', v)} />
             </InputGroup>
             <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {content.clients.logos.map((logo, i) => (
                   <div key={logo.id} className="relative border p-2 rounded bg-gray-50">
                      <button onClick={() => handleArrayRemove('clients', 'logos', i)} className="absolute top-1 right-1 text-red-500 bg-white rounded-full shadow p-1"><Trash2 size={12}/></button>
                      <ImageInput label={`Client ${i+1}`} value={logo.src} onChange={(v: any) => updateContent('clients', ['logos', i, 'src'], v)} />
                   </div>
                ))}
                <button onClick={() => handleArrayAdd('clients', 'logos', { id: Date.now(), src: '', alt: 'Client' })} className="border-2 border-dashed border-gray-300 rounded flex flex-col items-center justify-center p-4 text-black hover:bg-gray-50"><Plus size={24}/> Add Logo</button>
             </div>
             <SaveButton />
           </div>
        );
      case 'cta':
         return (
            <div className="space-y-6">
               <h2 className="text-2xl font-bold text-gray-900">CTA</h2>
               <InputGroup label="Content">
                  <TextInput label="Title Line 1" value={content.cta.titleLine1} onChange={(v: any) => updateContent('cta', 'titleLine1', v)} />
                  <TextInput label="Title Line 2" value={content.cta.titleLine2} onChange={(v: any) => updateContent('cta', 'titleLine2', v)} />
                  <TextInput label="Description" value={content.cta.description} onChange={(v: any) => updateContent('cta', 'description', v)} multiline />
                  <TextInput label="Button Text" value={content.cta.buttonText} onChange={(v: any) => updateContent('cta', 'buttonText', v)} />
               </InputGroup>
               <SaveButton />
            </div>
         );
      case 'footer':
         return (
            <div className="space-y-6">
               <h2 className="text-2xl font-bold text-gray-900">Footer</h2>
               <div className="space-y-2">
                  {content.footer.socials.map((social, i) => (
                     <div key={social.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded border">
                        <span className="uppercase font-bold text-xs w-20">{social.platform}</span>
                        <TextInput label="" value={social.url} onChange={(v: any) => updateContent('footer', ['socials', i, 'url'], v)} />
                        <button onClick={() => handleArrayRemove('footer', 'socials', i)} className="text-red-400"><Trash2 size={16}/></button>
                     </div>
                  ))}
                  <div className="flex gap-2 mt-2">
                     {['linkedin', 'twitter', 'instagram', 'facebook', 'website'].map(p => (
                        <button key={p} onClick={() => handleArrayAdd('footer', 'socials', { id: Date.now(), platform: p, url: '#' })} className="text-xs px-2 py-1 bg-gray-100 text-black rounded capitalize">+ {p}</button>
                     ))}
                  </div>
               </div>
               <SaveButton />
            </div>
         );
      default: return <div>Select a section</div>;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {mobileMenuOpen && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setMobileMenuOpen(false)}></div>}
      <aside className={`fixed md:sticky top-0 h-screen w-64 bg-white border-r border-gray-200 z-50 transform transition-transform duration-300 md:translate-x-0 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <div className="flex items-center gap-2 font-bold text-xl text-black"><LayoutDashboard /> Admin</div>
          <button className="md:hidden" onClick={() => setMobileMenuOpen(false)}><X /></button>
        </div>
        <div className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-140px)]">
          {tabs.map(tab => <SidebarItem key={tab.id} icon={tab.icon} label={tab.label} active={activeTab === tab.id} onClick={() => { setActiveTab(tab.id); setMobileMenuOpen(false); }} />)}
        </div>
        <div className="absolute bottom-0 left-0 w-full p-4 border-t border-gray-100 bg-white">
          <button onClick={logout} className="w-full flex items-center gap-2 justify-center text-red-500 font-medium hover:bg-red-50 p-2 rounded"><LogOut size={16}/> Logout</button>
        </div>
      </aside>
      <main className="flex-1 min-w-0">
         <div className="md:hidden bg-white p-4 border-b border-gray-200 flex items-center gap-4 sticky top-0 z-30 shadow-sm">
            <button onClick={() => setMobileMenuOpen(true)} className="p-2 text-black border border-gray-200 rounded bg-gray-50 hover:rotate-90 transition-transform duration-300"><Menu size={24} /></button>
            <span className="font-bold">Admin Panel</span>
         </div>
         <div className="p-6 md:p-10 max-w-4xl mx-auto pb-28 md:pb-20">
            {renderContent()}
         </div>
      </main>
    </div>
  );
};