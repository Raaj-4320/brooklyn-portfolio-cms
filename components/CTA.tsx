import React from 'react';
import { useContent } from '../context/ContentContext';
import { EditableText } from './ui/Editable';
import { ArrowRight } from 'lucide-react';

const CTA: React.FC = () => {
  const { content, isEditing, openContactModal } = useContent();

  const handleContactClick = () => {
    if (isEditing) return;
    openContactModal();
  };

  return (
    <section id="contact" className="bg-black py-24 relative overflow-hidden scroll-mt-24">
      <div className="container mx-auto px-6 text-center relative z-10">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-2">
           <EditableText section="cta" path="titleLine1" value={content.cta.titleLine1} />
        </h2>
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-8">
           <EditableText section="cta" path="titleLine2" value={content.cta.titleLine2} />
        </h2>
        
        <div className="max-w-2xl mx-auto text-gray-400 mb-10 leading-relaxed">
           <EditableText section="cta" path="description" value={content.cta.description} multiline />
        </div>

        <button 
            onClick={handleContactClick}
            className={`bg-white text-black font-bold py-4 px-10 rounded transition-all flex items-center gap-2 mx-auto shadow-lg ${isEditing ? '' : 'hover:bg-gray-200 hover:scale-105'}`}
        >
          <EditableText section="cta" path="buttonText" value={content.cta.buttonText} as="span" />
          <ArrowRight size={20} />
        </button>
      </div>
    </section>
  );
};

export default CTA;