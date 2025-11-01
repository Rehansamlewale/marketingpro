import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../auth/Auth.css';

const AddUser = ({ currentUser }) => {
  const [formData, setFormData] = useState({
    phone: '',
    userName: '',
    duration: '',
    role: 'user',
    referrer: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [fieldAnimations, setFieldAnimations] = useState({
    phone: false,
    userName: false,
    duration: false,
    role: false,
    referrer: false
  });
  const navigate = useNavigate();

  // Set referrer to current user's phone if admin is logged in
  useEffect(() => {
    if (currentUser?.phone) {
      setFormData(prev => ({
        ...prev,
        referrer: currentUser.phone
      }));
    }
    // Fade-in effect on mount
    setTimeout(() => setShowForm(true), 100);
    // Staggered field animations
    const fields = ['phone', 'userName', 'duration', 'role'];
    if (currentUser?.role === 'admin') fields.push('referrer');
    fields.forEach((field, index) => {
      setTimeout(() => {
        setFieldAnimations(prev => ({ ...prev, [field]: true }));
      }, 200 + index * 150);
    });
  }, [currentUser]);

  const durationOptions = [
    { value: 7 * 24 * 60 * 60 * 1000, label: '7 Days' },
    { value: 30 * 24 * 60 * 60 * 1000, label: '1 Month' },
    { value: 90 * 24 * 60 * 60 * 1000, label: '3 Months' },
    { value: 180 * 24 * 60 * 60 * 1000, label: '6 Months' },
    { value: 365 * 24 * 60 * 60 * 1000, label: '1 Year' },
    { value: 2 * 365 * 24 * 60 * 60 * 1000, label: '2 Years' },
    { value: 3 * 365 * 24 * 60 * 60 * 1000, label: '3 Years' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
    setFormData(prev => ({
      ...prev,
      phone: value
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setSuccess('');

  // Validate form
  if (!formData.phone.match(/^\d{10}$/)) {
    setError('Please enter a valid 10-digit phone number');
    return;
  }

  if (!formData.userName.trim()) {
    setError('Please enter a user name');
    return;
  }

  if (!formData.duration) {
    setError('Please select a duration');
    return;
  }

  setIsSubmitting(true);

  try {
    const now = Date.now();
    const phoneKey = `91${formData.phone}`;
    const userUrl = `https://scroller-4d10f-default-rtdb.firebaseio.com/MarketingPro/users/${phoneKey}.json`;

    // 🔹 Step 1: Check if user already exists
    const existingUserResponse = await fetch(userUrl);
    const existingUser = await existingUserResponse.json();

    if (existingUser) {
      // 🔸 Show alert and stop submission
      alert('User already exists with this phone number!');
      setIsSubmitting(false);
      return;
    }

    // 🔹 Step 2: Add new user if not existing
    const userData = {
      phone_number: phoneKey,
      user_name: formData.userName.trim(),
      created_at: now,
      expiry_date: now + parseInt(formData.duration),
      lastLogin: now,
      role: formData.role,
      status: 'active',
      referrer: formData.referrer || ''
    };

    const response = await fetch(userUrl, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });

    if (!response.ok) throw new Error('Failed to save user data');

    setSuccess('User added successfully!');
    setFormData({
      phone: '',
      userName: '',
      duration: '',
      role: 'user',
      referrer: currentUser?.phone || ''
    });

    // Redirect after short delay
    setTimeout(() => navigate('/dashboard'), 1500);
  } catch (err) {
    console.error('Error adding user:', err);
    setError('Failed to add user. Please try again.');
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-pink-400 to-red-600 rounded-full opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-green-400 to-blue-600 rounded-full opacity-10 animate-spin animation-duration-10000"></div>
      </div>
      
      <div className={`max-w-md w-full mx-auto bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden md:max-w-2xl p-8 transform transition-all duration-700 ${showForm ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'} relative z-10`}>
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full mb-6 shadow-lg animate-bounce">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">Add New User</h1>
          <p className="text-sm text-gray-600 animate-fade-in">Fill in the details below to create a new user account</p>
        </div>
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-xl text-sm animate-shake shadow-md">
            <div className="flex items-center">
              <svg className="w-6 h-6 mr-3 text-red-500 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
              </svg>
              {error}
            </div>
          </div>
        )}
        
        {success && (
          <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded-xl text-sm animate-bounce shadow-md">
            <div className="flex items-center">
              <svg className="w-6 h-6 mr-3 text-green-500 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
              </svg>
              {success}
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className={`group transform transition-all duration-500 ${fieldAnimations.phone ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'}`}>
            <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2 transition-colors group-focus-within:text-indigo-600">
              Mobile Number
            </label>
            <div className="mt-1 flex rounded-xl shadow-sm border border-gray-300 focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-200 transition-all duration-300 bg-white/50 backdrop-blur-sm">
              <span className="inline-flex items-center px-4 rounded-l-xl border-r border-gray-300 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-600 text-sm font-medium">
                +91
              </span>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handlePhoneChange}
                placeholder="Enter 10-digit mobile number"
                className="flex-1 min-w-0 block w-full px-4 py-3 rounded-none rounded-r-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-0 bg-transparent"
                maxLength="10"
                required
              />
            </div>
          </div>
          
          <div className={`group transform transition-all duration-500 ${fieldAnimations.userName ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'}`}>
            <label htmlFor="userName" className="block text-sm font-semibold text-gray-700 mb-2 transition-colors group-focus-within:text-indigo-600">
              User Name
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="userName"
                name="userName"
                value={formData.userName}
                onChange={handleChange}
                placeholder="Enter full name"
                className="block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-200 transition-all duration-300 bg-white/50 backdrop-blur-sm"
                required
              />
            </div>
          </div>
          
          <div className={`group transform transition-all duration-500 ${fieldAnimations.duration ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'}`}>
            <label htmlFor="duration" className="block text-sm font-semibold text-gray-700 mb-2 transition-colors group-focus-within:text-indigo-600">
              Subscription Duration
            </label>
            <div className="mt-1 relative">
              <select
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className="block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-200 transition-all duration-300 appearance-none bg-white/50 backdrop-blur-sm"
                required
              >
                <option value="">Select duration</option>
                {durationOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                <svg className="w-5 h-5 text-gray-500 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
          </div>
          
          <div className={`group transform transition-all duration-500 ${fieldAnimations.role ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'}`}>
            <label htmlFor="role" className="block text-sm font-semibold text-gray-700 mb-2 transition-colors group-focus-within:text-indigo-600">
              User Role
            </label>
            <div className="mt-1 relative">
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-200 transition-all duration-300 appearance-none bg-white/50 backdrop-blur-sm"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                <svg className="w-5 h-5 text-gray-500 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
          </div>
          
          {currentUser?.role === 'admin' && (
            <div className={`group transform transition-all duration-500 ${fieldAnimations.referrer ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'}`}>
              <label htmlFor="referrer" className="block text-sm font-semibold text-gray-700 mb-2 transition-colors group-focus-within:text-indigo-600">
                Referrer (Optional)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="referrer"
                  name="referrer"
                  value={formData.referrer}
                  onChange={handleChange}
                  placeholder="Referrer's mobile number"
                  className="block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-200 transition-all duration-300 bg-white/50 backdrop-blur-sm"
                />
              </div>
            </div>
          )}
          
          <div className="pt-6">
            <button
              type="submit"
              className={`w-full flex justify-center py-4 px-6 border border-transparent rounded-xl shadow-xl text-sm font-bold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl ${isSubmitting ? 'opacity-70 cursor-not-allowed hover:scale-100' : ''}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Adding User...
                </>
              ) : (
                <>
                  <svg className="w-6 h-6 mr-3 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                  Add User
                </>
              )}
            </button>
          </div>
        </form>
        
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-sm font-semibold text-indigo-600 hover:text-indigo-500 transition-all duration-300 hover:scale-110"
          >
                       <svg className="w-5 h-5 mr-2 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
            </svg>
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddUser;