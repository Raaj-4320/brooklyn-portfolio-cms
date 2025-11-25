import React, { useState } from 'react';
import { useContent } from '../context/ContentContext';
import { Lock, Loader2, ArrowRight, UserPlus, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Login: React.FC = () => {
  const { login, register } = useContent();
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({ name: '', username: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    let success = false;
    if (isRegister) {
      success = await register(formData);
    } else {
      success = await login(formData.password, formData.email);
    }

    if (success) {
      navigate('/admin');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center text-white">
            {isRegister ? <UserPlus size={32} /> : <Lock size={32} />}
          </div>
        </div>
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
          {isRegister ? "Create Account" : "Login"}
        </h2>
        <p className="text-center text-gray-500 mb-8">
          {isRegister ? "Start building your portfolio today." : "Manage your portfolio."}
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <>
              <input type="text" name="name" placeholder="Full Name" required value={formData.name} onChange={handleChange} className="w-full p-4 border rounded-lg" />
              <input type="text" name="username" placeholder="Username (unique)" required value={formData.username} onChange={handleChange} className="w-full p-4 border rounded-lg" />
            </>
          )}
          <input type="email" name="email" placeholder="Email Address" required value={formData.email} onChange={handleChange} className="w-full p-4 border rounded-lg" />
          <input type="password" name="password" placeholder="Password" required value={formData.password} onChange={handleChange} className="w-full p-4 border rounded-lg" />
          
          <button type="submit" disabled={loading} className="w-full bg-black text-white py-4 rounded-lg font-bold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
            {loading ? <Loader2 className="animate-spin" /> : <>{isRegister ? "Sign Up" : "Login"} <ArrowRight size={18}/></>}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <button onClick={() => setIsRegister(!isRegister)} className="text-sm text-gray-600 hover:text-black font-medium underline">
            {isRegister ? "Already have an account? Login" : "New here? Create an Account"}
          </button>
        </div>
      </div>
    </div>
  );
};