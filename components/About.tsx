import React from 'react';
import { useContent } from '../context/ContentContext';
import { EditableText, EditableImage } from './ui/Editable';

const About: React.FC = () => {
  const { content, isEditing } = useContent();

  const handleScrollToContact = () => {
    if (isEditing) return;
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="about" className="py-20 bg-white relative overflow-hidden scroll-mt-24">
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-purple-50 to-transparent -z-10"></div>
      
      <div className="container mx-auto px-6 flex flex-col-reverse md:flex-row items-center gap-16">
        
        {/* Left Text */}
        <div className="w-full md:w-1/2 space-y-8">
          <div>
            <h3 className="text-2xl text-gray-800 font-medium mb-2">
              <EditableText section="about" path="greeting" value={content.about.greeting} />
            </h3>
            <h2 className="text-5xl font-bold text-gray-900 mb-2 tracking-tight">
              <EditableText section="about" path="name" value={content.about.name} />
            </h2>
          </div>

          <div className="text-xl text-gray-600 leading-relaxed">
            <EditableText section="about" path="prefix" value={content.about.prefix} as="span" className="mr-1" />
            <span className="mx-1 px-1 bg-pink-100 text-pink-800 font-semibold rounded inline-block">
               <EditableText section="about" path="role1" value={content.about.role1} as="span"/>
            </span>
             and 
            <span className="mx-1 px-1 bg-pink-100 text-pink-800 font-semibold rounded inline-block">
               <EditableText section="about" path="role2" value={content.about.role2} as="span"/>
            </span>
            <EditableText section="about" path="suffix" value={content.about.suffix} as="span" className="ml-1" />
            <div className="mt-4 block">
               <EditableText section="about" path="description" value={content.about.description} multiline />
            </div>
          </div>

          <button 
            onClick={handleScrollToContact}
            className={`bg-violet-600 text-white font-bold py-3 px-8 rounded transition-all shadow-lg shadow-violet-200 ${isEditing ? '' : 'hover:bg-violet-700 transform hover:-translate-y-1'}`}
          >
            <EditableText section="about" path="buttonText" value={content.about.buttonText} as="span" />
          </button>

          <div className="grid grid-cols-3 gap-4 pt-8 mt-8 border-t border-gray-100">
            <div className="bg-purple-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-gray-900">
                <EditableText section="about" path={['stats', 'experience']} value={content.about.stats.experience} />
              </div>
              <div className="text-sm text-gray-500 mt-1">
                 <EditableText section="about" path={['statsLabels', 'experience']} value={content.about.statsLabels.experience} />
              </div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-gray-900">
                <EditableText section="about" path={['stats', 'projects']} value={content.about.stats.projects} />
              </div>
              <div className="text-sm text-gray-500 mt-1">
                <EditableText section="about" path={['statsLabels', 'projects']} value={content.about.statsLabels.projects} />
              </div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-gray-900">
                <EditableText section="about" path={['stats', 'clients']} value={content.about.stats.clients} />
              </div>
              <div className="text-sm text-gray-500 mt-1">
                <EditableText section="about" path={['statsLabels', 'clients']} value={content.about.statsLabels.clients} />
              </div>
            </div>
          </div>
        </div>

        {/* Right Image */}
        <div className="w-full md:w-1/2">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/5]">
            <EditableImage 
              section="about" 
              path="image" 
              src={content.about.image} 
              alt="About Brooklyn" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;