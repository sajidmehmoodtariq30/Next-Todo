import { useState, useEffect } from 'react';

export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      if (typeof window !== 'undefined') {
        const item = window.localStorage.getItem(key);
        return item ? JSON.parse(item) : initialValue;
      }
      return initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
}

export function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export function useFileUpload() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const uploadFile = async (file, endpoint, additionalData = {}) => {
    if (!file) return { success: false, error: 'No file selected' };

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      
      Object.keys(additionalData).forEach(key => {
        formData.append(key, additionalData[key]);
      });

      const response = await fetch(endpoint, {
        method: 'POST',
        credentials: 'include',
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        return { success: true, data };
      } else {
        setError(data.error || 'Upload failed');
        return { success: false, error: data.error };
      }
    } catch (err) {
      const errorMessage = 'Network error during upload';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setUploading(false);
    }
  };

  return {
    uploading,
    error,
    uploadFile,
    clearError: () => setError(null)
  };
}

export function useFormValidation() {
  const [errors, setErrors] = useState({});

  const validateField = (name, value, rules = {}) => {
    let error = '';

    if (rules.required && (!value || value.trim() === '')) {
      error = `${name} is required`;
    } else if (rules.minLength && value.length < rules.minLength) {
      error = `${name} must be at least ${rules.minLength} characters`;
    } else if (rules.maxLength && value.length > rules.maxLength) {
      error = `${name} cannot exceed ${rules.maxLength} characters`;
    } else if (rules.pattern && !rules.pattern.test(value)) {
      error = rules.message || `${name} format is invalid`;
    } else if (rules.email && !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value)) {
      error = 'Please enter a valid email address';
    }

    setErrors(prev => ({
      ...prev,
      [name]: error
    }));

    return !error;
  };

  const validateForm = (formData, validationRules) => {
    const newErrors = {};
    let isValid = true;

    Object.keys(validationRules).forEach(field => {
      const value = formData[field] || '';
      const rules = validationRules[field];
      
      if (!validateField(field, value, rules)) {
        isValid = false;
      }
    });

    return isValid;
  };

  const clearErrors = () => setErrors({});
  
  const clearFieldError = (fieldName) => {
    setErrors(prev => ({
      ...prev,
      [fieldName]: ''
    }));
  };

  return {
    errors,
    validateField,
    validateForm,
    clearErrors,
    clearFieldError
  };
}
