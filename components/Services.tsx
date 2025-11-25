import React from 'react';
import { useContent } from '../context/ContentContext';
import { EditableText } from './ui/Editable';
import { Layout, Settings, Layers, ChevronRight } from 'lucide-react';

const iconMap = {
  layout: Layout,
  settings: Settings,
  layers: Layers
};

const Services: React.FC = () => {
  const { content, isEditing } = useContent();

  const handleServiceClick = () => {
     if (isEditing) return;
     document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="services" className="bg-[#051125] py-24 text-white scroll-mt-24">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-green-400 font-medium mb-4 flex justify-center items-center gap-2">
             <span className="w-2 h-2 rounded-full bg-green-400"></span> 
             <EditableText section="services" path="badge" value={content.services.badge} as="span" />
          </p>
          <h2 className="text-3xl md:text-4xl font-bold leading-tight">
            <EditableText section="services" path="title" value={content.services.title} as="span"/>
            <br className="hidden md:block" />
            <EditableText section="services" path="subtitle" value={content.services.subtitle} as="span"/>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {content.services.cards.map((card, index) => {
            const Icon = iconMap[card.iconType as keyof typeof iconMap] || Layout;
            return (
              <div 
                key={card.id} 
                className={`bg-[#0a192f] p-10 rounded-xl transition-all group border border-gray-800 ${isEditing ? '' : 'hover:bg-[#0e2340] hover:border-violet-500/30'}`}
              >
                <div className="mb-6 text-violet-500 group-hover:scale-110 transition-transform duration-300 inline-block">
                   <Icon size={48} strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-bold mb-4 min-h-[3rem] flex items-center">
                  <EditableText section="services" path={['cards', index, 'title']} value={card.title} />
                </h3>
                <div className="text-gray-400 mb-8 leading-relaxed text-sm">
                   <EditableText section="services" path={['cards', index, 'description']} value={card.description} multiline />
                </div>
                <button 
                    onClick={handleServiceClick}
                    className={`text-violet-400 font-medium flex items-center gap-1 transition-all ${isEditing ? '' : 'hover:gap-2 group-hover:text-violet-300'}`}
                >
                  <EditableText section="services" path="buttonText" value={content.services.buttonText} as="span" /> 
                  <ChevronRight size={16} />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;