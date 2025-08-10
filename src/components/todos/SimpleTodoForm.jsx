"use client";

import { useState, useEffect } from 'react';
import { useTodos } from '@/contexts/TodosContext';

const SimpleTodoForm = ({ isOpen, onClose, todo = null }) => {
  const isEditing = Boolean(todo);
  
  const [title, setTitle] = useState(todo?.title || '');
  const [description, setDescription] = useState(todo?.description || '');
  const [priority, setPriority] = useState(todo?.priority || 'medium');
  const [category, setCategory] = useState(todo?.category || 'general');
  
  const { createTodo, updateTodo, isLoading, error, clearError } = useTodos();

  console.log('SimpleTodoForm rendered, isOpen:', isOpen, 'isEditing:', isEditing);

  // Update form when todo prop changes
  useEffect(() => {
    if (todo) {
      setTitle(todo.title || '');
      setDescription(todo.description || '');
      setPriority(todo.priority || 'medium');
      setCategory(todo.category || 'general');
    }
  }, [todo]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const todoData = {
      title: title.trim(),
      description: description.trim(),
      priority,
      category
    };
    
    console.log('Form submitted:', todoData, 'isEditing:', isEditing);
    
    let result;
    if (isEditing) {
      result = await updateTodo(todo._id, todoData);
    } else {
      result = await createTodo(todoData);
    }
    
    if (result.success) {
      console.log(`Todo ${isEditing ? 'updated' : 'created'} successfully!`);
      // Reset form
      if (!isEditing) {
        setTitle('');
        setDescription('');
        setPriority('medium');
        setCategory('general');
      }
      onClose();
    } else {
      console.error(`Failed to ${isEditing ? 'update' : 'create'} todo:`, result.error);
    }
  };

  if (!isOpen) {
    console.log('SimpleTodoForm: not open, returning null');
    return null;
  }

  console.log('SimpleTodoForm: rendering modal');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
          {isEditing ? 'Edit Todo' : 'Create New Todo'}
        </h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter todo title"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter todo description"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="general">General</option>
                <option value="work">Work</option>
                <option value="personal">Personal</option>
                <option value="shopping">Shopping</option>
                <option value="health">Health</option>
                <option value="education">Education</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !title.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isLoading && (
                <div className="w-4 h-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2"></div>
              )}
              {isLoading ? (isEditing ? 'Updating...' : 'Creating...') : (isEditing ? 'Update Todo' : 'Create Todo')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SimpleTodoForm;
