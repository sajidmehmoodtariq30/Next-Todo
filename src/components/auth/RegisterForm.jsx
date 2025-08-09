"use client";

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useFormValidation } from '@/hooks';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

const RegisterForm = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const { register, isLoading, error, clearError } = useAuth();
  const { errors, validateField, clearFieldError } = useFormValidation();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear errors when user starts typing
    if (errors[name]) {
      clearFieldError(name);
    }
    if (error) {
      clearError();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    const nameValid = validateField('name', formData.name, {
      required: true,
      minLength: 2,
      maxLength: 50
    });

    const emailValid = validateField('email', formData.email, {
      required: true,
      email: true
    });

    const passwordValid = validateField('password', formData.password, {
      required: true,
      minLength: 6
    });

    let confirmPasswordValid = true;
    if (formData.password !== formData.confirmPassword) {
      validateField('confirmPassword', formData.confirmPassword, {
        required: true,
        pattern: new RegExp(`^${formData.password}$`),
        message: 'Passwords do not match'
      });
      confirmPasswordValid = false;
    }

    if (!nameValid || !emailValid || !passwordValid || !confirmPasswordValid) {
      return;
    }

    const result = await register(formData.name, formData.email, formData.password);
    
    if (!result.success) {
      // Error is handled by the context
      console.log('Registration failed:', result.error);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Create Account</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Sign up to get started</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            type="text"
            name="name"
            label="Full Name"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={handleInputChange}
            error={errors.name}
            required
            disabled={isLoading}
          />

          <Input
            type="email"
            name="email"
            label="Email Address"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleInputChange}
            error={errors.email}
            required
            disabled={isLoading}
          />

          <Input
            type="password"
            name="password"
            label="Password"
            placeholder="Create a password (min. 6 characters)"
            value={formData.password}
            onChange={handleInputChange}
            error={errors.password}
            required
            disabled={isLoading}
          />

          <Input
            type="password"
            name="confirmPassword"
            label="Confirm Password"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            error={errors.confirmPassword}
            required
            disabled={isLoading}
          />

          <Button
            type="submit"
            className="w-full"
            loading={isLoading}
            disabled={isLoading}
          >
            Create Account
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
