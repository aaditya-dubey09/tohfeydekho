import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/slices/authSlice';
import { authAPI } from '../services/api';

const Register = () => {
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await authAPI.register(formData);
      dispatch(setUser(data.data));
      navigate('/');
    } catch (error) {
      alert(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-gray-50 rounded-[2rem]">
      <h2 className="text-3xl font-black mb-8">Create Account</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-bold mb-2 uppercase tracking-widest">Full Name</label>
          <input
            type="text"
            className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-black outline-none transition-colors"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-bold mb-2 uppercase tracking-widest">Email</label>
          <input
            type="email"
            className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-black outline-none transition-colors"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-bold mb-2 uppercase tracking-widest">Password</label>
          <input
            type="password"
            className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-black outline-none transition-colors"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
        </div>
        <button className="w-full py-4 bg-black text-white rounded-xl font-black text-lg hover:bg-gray-800 transition-colors">
          Register
        </button>
      </form>
      <p className="mt-6 text-center text-gray-600">
        Already have an account? <Link to="/login" className="font-bold text-black underline">Login</Link>
      </p>
    </div>
  );
};

export default Register;
