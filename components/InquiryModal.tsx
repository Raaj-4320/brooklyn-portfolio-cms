import React, { useState } from 'react';
import { useContent, API_BASE_URL } from '../context/ContentContext';
import { X, Send, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

export const InquiryModal: React.FC = () => {
  const { isContactModalOpen, closeContactModal, content } = useContent();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    country: '',
    category: 'UI/UX Design',
    productName: '',
    productDetails: '',
    description: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if this is a real user's portfolio
    if (!content.owner) {
      return; // Logic handled by UI disabled state below
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/inquiry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          ownerId: content.owner // Critical: Route to specific user
        })
      });

      const data = await response.json();

      if (data.success) {
        setIsSuccess(true);
        setTimeout(() => {
          closeContactModal();
          setIsSuccess(false);
          setFormData({
            email: '',
            phone: '',
            country: '',
            category: 'UI/UX Design',
            productName: '',
            productDetails: '',
            description: ''
          });
        }, 3000);
      } else {
        alert('Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert('Failed to send inquiry. Check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isContactModalOpen) return null;

  // Check if we are in Demo Mode (No Owner)
  const isDemoMode = !content.owner;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={closeContactModal}></div>
      
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="bg-black p-6 flex justify-between items-center text-white">
          <div>
            <h3 className="text-2xl font-bold">Start Your Project</h3>
            <p className="text-gray-400 text-sm">Tell us about your vision</p>
          </div>
          <button onClick={closeContactModal} className="p-2 hover:bg-gray-800 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 md:p-8 overflow-y-auto">
          {isSuccess ? (
            <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-2">
                <CheckCircle size={40} />
              </div>
              <h4 className="text-2xl font-bold text-gray-900">Inquiry Sent!</h4>
              <p className="text-gray-500 max-w-xs">The portfolio owner has received your details.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {isDemoMode && (
                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg flex gap-3 items-start">
                  <AlertCircle className="text-yellow-600 shrink-0 mt-0.5" size={20} />
                  <div>
                    <h4 className="font-bold text-yellow-800 text-sm">Demo Mode</h4>
                    <p className="text-yellow-700 text-xs mt-1">This is an example page. Inquiries are disabled here. To test inquiries, please create an account and view your public profile.</p>
                  </div>
                </div>
              )}

              {/* Contact Info Row */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Contact Email *</label>
                  <input 
                    required
                    disabled={isDemoMode}
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black outline-none bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="you@company.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
                  <input 
                    disabled={isDemoMode}
                    type="tel" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black outline-none bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>

              {/* Location & Category */}
              <div className="grid md:grid-cols-2 gap-6">
                 <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Country</label>
                  <input 
                    disabled={isDemoMode}
                    type="text" 
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black outline-none bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="e.g. United Kingdom"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Product Category</label>
                  <select 
                    disabled={isDemoMode}
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black outline-none bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option>UI/UX Design</option>
                    <option>Web Development</option>
                    <option>Mobile App Development</option>
                    <option>Branding</option>
                    <option>Consultancy</option>
                  </select>
                </div>
              </div>

               {/* Product Names */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Product Name(s) *</label>
                <input 
                  required
                  disabled={isDemoMode}
                  type="text" 
                  name="productName"
                  value={formData.productName}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black outline-none bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="e.g. Project Alpha, Website Redesign"
                />
              </div>

              {/* Short Details */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Product Details Summary</label>
                <textarea 
                  disabled={isDemoMode}
                  name="productDetails"
                  value={formData.productDetails}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black outline-none bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Brief overview of features..."
                />
              </div>

              {/* Long Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Detailed Description</label>
                <textarea 
                  required
                  disabled={isDemoMode}
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={5}
                  maxLength={6000} 
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black outline-none bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Describe your project requirements in detail..."
                />
              </div>

              <button 
                type="submit" 
                disabled={isLoading || isDemoMode}
                className="w-full bg-black text-white py-4 rounded-lg font-bold text-lg hover:bg-gray-800 transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" /> Sending...
                  </>
                ) : (
                  <>
                    Submit Inquiry <Send size={18} />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};