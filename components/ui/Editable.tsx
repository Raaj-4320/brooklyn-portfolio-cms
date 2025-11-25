import React, { useState, useRef, useEffect } from 'react';
import { useContent } from '../../context/ContentContext';
import { Pencil, Check, X, Sparkles, Wand2, ImageIcon } from 'lucide-react';
import { rewriteText } from '../../services/gemini';

interface EditableTextProps {
  section: any;
  path: string | (string | number)[];
  value: string;
  className?: string;
  multiline?: boolean;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
}

export const EditableText: React.FC<EditableTextProps> = ({ 
  section, 
  path, 
  value, 
  className = "", 
  multiline = false,
  as: Component = 'div' 
}) => {
  const { isEditing, updateContent } = useContent();
  const [tempValue, setTempValue] = useState(value);
  const [isFocused, setIsFocused] = useState(false);
  const [isRewriting, setIsRewriting] = useState(false);

  useEffect(() => {
    setTempValue(value);
  }, [value]);

  const handleSave = () => {
    updateContent(section, path, tempValue);
    setIsFocused(false);
  };

  const handleCancel = () => {
    setTempValue(value);
    setIsFocused(false);
  };

  const handleAiRewrite = async () => {
    setIsRewriting(true);
    const newValue = await rewriteText(tempValue, 'professional');
    setTempValue(newValue);
    setIsRewriting(false);
  };

  if (!isEditing) {
    return <Component className={className}>{value}</Component>;
  }

  return (
    <div className={`relative group ${className} min-h-[1.5em] border-2 border-transparent hover:border-violet-300 rounded p-1 transition-all`}>
      {isFocused ? (
        <div className="absolute z-50 top-full left-0 mt-1 bg-white shadow-xl rounded-lg p-2 min-w-[300px] border border-gray-200">
          {multiline ? (
            <textarea
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              className="w-full p-2 border rounded text-gray-800 text-base min-h-[100px]"
            />
          ) : (
            <input
              type="text"
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              className="w-full p-2 border rounded text-gray-800 text-base"
            />
          )}
          <div className="flex justify-between mt-2">
             <button 
              onClick={handleAiRewrite}
              disabled={isRewriting}
              className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded hover:opacity-90 text-xs font-medium"
            >
              {isRewriting ? <Sparkles className="w-3 h-3 animate-spin" /> : <Wand2 className="w-3 h-3" />}
              {isRewriting ? 'Thinking...' : 'AI Rewrite'}
            </button>
            <div className="flex gap-2">
              <button onClick={handleCancel} className="p-1 bg-gray-200 rounded hover:bg-gray-300 text-gray-600">
                <X className="w-4 h-4" />
              </button>
              <button onClick={handleSave} className="p-1 bg-green-500 rounded hover:bg-green-600 text-white">
                <Check className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div 
          className="cursor-pointer w-full h-full relative"
          onClick={() => setIsFocused(true)}
        >
          {value}
          <div className="absolute -top-3 -right-3 bg-violet-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
            <Pencil className="w-3 h-3" />
          </div>
        </div>
      )}
    </div>
  );
};

interface EditableImageProps {
  section: any;
  path: string | (string | number)[];
  src: string;
  alt: string;
  className?: string;
}

export const EditableImage: React.FC<EditableImageProps> = ({ section, path, src, alt, className }) => {
  const { isEditing, updateContent } = useContent();
  const [isPromptOpen, setIsPromptOpen] = useState(false);
  const [newUrl, setNewUrl] = useState(src);

  if (!isEditing) {
    return <img src={src} alt={alt} className={className} />;
  }

  const handleSave = () => {
    updateContent(section, path, newUrl);
    setIsPromptOpen(false);
  };

  return (
    <div className={`relative group ${className}`}>
      <img src={src} alt={alt} className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        <button 
          onClick={() => setIsPromptOpen(true)}
          className="bg-white text-gray-900 px-3 py-2 rounded-full font-medium text-sm flex items-center gap-2 shadow-lg transform scale-95 group-hover:scale-100 transition-transform"
        >
          <ImageIcon className="w-4 h-4" />
          Change Image
        </button>
      </div>

      {isPromptOpen && (
        <div className="absolute z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded-lg shadow-2xl w-80 border border-gray-200">
           <h4 className="text-sm font-bold mb-2 text-gray-700">Image URL</h4>
           <input 
            type="text" 
            value={newUrl} 
            onChange={(e) => setNewUrl(e.target.value)}
            className="w-full border p-2 rounded mb-3 text-sm"
            placeholder="https://..."
           />
           <div className="flex justify-end gap-2">
             <button onClick={() => setIsPromptOpen(false)} className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
             <button onClick={handleSave} className="px-3 py-1 text-sm bg-violet-600 text-white rounded hover:bg-violet-700">Save</button>
           </div>
        </div>
      )}
    </div>
  );
};
