"use client";

import { useState } from 'react';
import { useTodos } from '@/contexts/TodosContext';
import { useFormValidation } from '@/hooks';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Modal from '@/components/ui/Modal';

const TodoForm = ({ isOpen, onClose, todo = null }) => {
  const isEditing = Boolean(todo);
  
  const [formData, setFormData] = useState({
    title: todo?.title || '',
    description: todo?.description || '',
    priority: todo?.priority || 'medium',
    category: todo?.category || 'general',
    dueDate: todo?.dueDate ? new Date(todo.dueDate).toISOString().split('T')[0] : ''
  });

  const { createTodo, updateTodo, isLoading, error, clearError } = useTodos();
  const { errors, validateField, clearFieldError } = useFormValidation();

  const priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' }
  ];

  const categoryOptions = [
    { value: 'general', label: 'General' },
    { value: 'work', label: 'Work' },
    { value: 'personal', label: 'Personal' },
    { value: 'shopping', label: 'Shopping' },
    { value: 'health', label: 'Health' },
    { value: 'education', label: 'Education' }
  ];

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
    const titleValid = validateField('title', formData.title, {
      required: true,
      minLength: 1,
      maxLength: 100
    });

    if (!titleValid) {
      return;
    }

    const todoData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      priority: formData.priority,
      category: formData.category,
      dueDate: formData.dueDate || null
    };

    let result;
    if (isEditing) {
      result = await updateTodo(todo._id, todoData);
    } else {
      result = await createTodo(todoData);
    }

    if (result.success) {
      onClose();
      // Reset form
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        category: 'general',
        dueDate: ''
      });
    }
  };

  const handleClose = () => {
    clearError();
    setFormData({
      title: todo?.title || '',
      description: todo?.description || '',
      priority: todo?.priority || 'medium',
      category: todo?.category || 'general',
      dueDate: todo?.dueDate ? new Date(todo.dueDate).toISOString().split('T')[0] : ''
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEditing ? 'Edit Todo' : 'Create New Todo'}
      size="large"
    >
      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          name="title"
          label="Title"
          placeholder="Enter todo title"
          value={formData.title}
          onChange={handleInputChange}
          error={errors.title}
          required
          disabled={isLoading}
        />

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Description
          </label>
          <textarea
            name="description"
            placeholder="Enter todo description (optional)"
            value={formData.description}
            onChange={handleInputChange}
            disabled={isLoading}
            rows={3}
            className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:border-blue-500 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Select
            name="priority"
            label="Priority"
            value={formData.priority}
            onChange={handleInputChange}
            options={priorityOptions}
            disabled={isLoading}
          />

          <Select
            name="category"
            label="Category"
            value={formData.category}
            onChange={handleInputChange}
            options={categoryOptions}
            disabled={isLoading}
          />
        </div>

        <Input
          type="date"
          name="dueDate"
          label="Due Date"
          value={formData.dueDate}
          onChange={handleInputChange}
          disabled={isLoading}
        />

        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={isLoading}
            disabled={isLoading}
          >
            {isEditing ? 'Update Todo' : 'Create Todo'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default TodoForm;
