import React from 'react';
import { useContent } from '../context/ContentContext';
import { EditableText, EditableImage } from './ui/Editable';

const Clients: React.FC = () => {
  const { content } = useContent();

  return (
    <section id="portfolio" className="py-20 bg-white scroll-mt-24">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
           <EditableText section="clients" path="title" value={content.clients.title} />
        </h2>
        <div className="text-gray-500 max-w-xl mx-auto mb-12">
           <EditableText section="clients" path="subtitle" value={content.clients.subtitle} multiline />
        </div>

        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20">
          {content.clients.logos.map((logo, index) => (
             <div key={logo.id} className="w-32 h-12 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                <EditableImage 
                  section="clients" 
                  path={['logos', index, 'src']} 
                  src={logo.src} 
                  alt={logo.alt}
                  className="w-full h-full object-contain"
                />
             </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Clients;