"use client";

import { useState } from 'react';
import { useTodos } from '@/contexts/TodosContext';
import { formatDate, isOverdue, getPriorityColor } from '@/utils/helpers';
import Button from '@/components/ui/Button';
import TodoForm from './TodoForm';

const TodoItem = ({ todo }) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const { toggleTodoComplete, deleteTodo, isLoading } = useTodos();

  const handleToggleComplete = async () => {
    await toggleTodoComplete(todo._id, !todo.completed);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this todo?')) {
      await deleteTodo(todo._id);
    }
  };

  const handleEdit = () => {
    setShowEditModal(true);
  };

  const dueDatePassed = todo.dueDate && isOverdue(todo.dueDate) && !todo.completed;

  return (
    <>
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 transition-all duration-200 hover:shadow-md ${todo.completed ? 'opacity-75' : ''}`}>
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            {/* Checkbox */}
            <button
              onClick={handleToggleComplete}
              disabled={isLoading}
              className="mt-1 flex-shrink-0"
            >
              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors duration-200 ${
                todo.completed 
                  ? 'bg-green-500 border-green-500 text-white' 
                  : 'border-gray-300 dark:border-gray-600 hover:border-green-500'
              }`}>
                {todo.completed && (
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </button>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h3 className={`text-lg font-medium ${todo.completed ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-white'}`}>
                {todo.title}
              </h3>
              
              {todo.description && (
                <p className={`mt-1 text-sm ${todo.completed ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-600 dark:text-gray-300'}`}>
                  {todo.description}
                </p>
              )}

              {/* Meta information */}
              <div className="flex flex-wrap items-center mt-3 space-x-4 text-xs">
                {/* Priority */}
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(todo.priority)}`}>
                  {todo.priority}
                </span>

                {/* Category */}
                <span className="inline-flex items-center text-gray-500 dark:text-gray-400">
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  {todo.category}
                </span>

                {/* Due date */}
                {todo.dueDate && (
                  <span className={`inline-flex items-center ${dueDatePassed ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'}`}>
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {formatDate(todo.dueDate)}
                    {dueDatePassed && ' (Overdue)'}
                  </span>
                )}

                {/* Created date */}
                <span className="text-gray-400 dark:text-gray-500">
                  Created {formatDate(todo.createdAt)}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2 ml-4">
            <Button
              variant="ghost"
              size="small"
              onClick={handleEdit}
              disabled={isLoading}
              className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </Button>
            
            <Button
              variant="ghost"
              size="small"
              onClick={handleDelete}
              disabled={isLoading}
              className="text-gray-400 hover:text-red-600 dark:hover:text-red-400"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </Button>
          </div>
        </div>
      </div>

      <TodoForm
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        todo={todo}
      />
    </>
  );
};

export default TodoItem;
