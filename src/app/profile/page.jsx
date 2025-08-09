"use client";

import { useState, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Loading from '@/components/ui/Loading';
import Image from 'next/image';

const ProfilePage = () => {
  const { user, updateUser, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    bio: user?.bio || ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setMessage({ type: '', text: '' });
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setMessage({ type: 'error', text: 'File size must be less than 5MB' });
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        setMessage({ type: 'error', text: 'Please select an image file' });
        return;
      }
      
      setSelectedFile(file);
      setMessage({ type: '', text: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    setMessage({ type: '', text: '' });

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('bio', formData.bio);
      
      if (selectedFile) {
        formDataToSend.append('profileImage', selectedFile);
      }

      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        credentials: 'include',
        body: formDataToSend
      });

      const data = await response.json();

      if (response.ok) {
        updateUser(data.user);
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to update profile' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return <Loading fullScreen />;
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Profile Settings
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Manage your profile information and settings.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl overflow-hidden">
            <div className="p-8">
              {/* Message Display */}
              {message.text && (
                <div className={`mb-6 p-4 rounded-lg border ${
                  message.type === 'success' 
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400'
                    : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400'
                }`}>
                  {message.text}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Profile Image Section */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:space-x-8">
                  <div className="flex-shrink-0">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-700">
                      {user?.profileImage ? (
                        <Image
                          src={user.profileImage}
                          alt="Profile"
                          width={128}
                          height={128}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold">
                          {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-4 sm:mt-0 flex-1">
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Profile Picture
                      </label>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        disabled={isUpdating}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900/50 dark:file:text-blue-300 dark:hover:file:bg-blue-900/75"
                      />
                      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                        PNG, JPG, GIF up to 5MB
                      </p>
                    </div>
                    {selectedFile && (
                      <p className="text-sm text-green-600 dark:text-green-400">
                        Selected: {selectedFile.name}
                      </p>
                    )}
                  </div>
                </div>

                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    name="name"
                    label="Full Name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    required
                    disabled={isUpdating}
                  />
                  
                  <Input
                    label="Email Address"
                    value={user?.email || ''}
                    disabled={true}
                    className="bg-gray-50 dark:bg-gray-700"
                  />
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    placeholder="Tell us a little about yourself..."
                    disabled={isUpdating}
                    rows={4}
                    className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:border-blue-500 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  />
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    Maximum 200 characters
                  </p>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end pt-6 border-t border-gray-200 dark:border-gray-700">
                  <Button
                    type="submit"
                    loading={isUpdating}
                    disabled={isUpdating}
                    className="min-w-[120px]"
                  >
                    {isUpdating ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </form>
            </div>
          </div>

          {/* Account Information */}
          <div className="mt-8 bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Account Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div>
                <span className="text-gray-500 dark:text-gray-400">Member since:</span>
                <span className="ml-2 text-gray-900 dark:text-white">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">Email:</span>
                <span className="ml-2 text-gray-900 dark:text-white">{user?.email}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default ProfilePage;
