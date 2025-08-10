"use client";

import { useState, useEffect } from 'react';
import { useTodos } from '@/contexts/TodosContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import TodoFilters from '@/components/todos/TodoFilters';
import TodoItem from '@/components/todos/TodoItem';
import SimpleTodoForm from '@/components/todos/SimpleTodoForm';
import Button from '@/components/ui/Button';
import Loading from '@/components/ui/Loading';

const TodosPage = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { 
    todos, 
    isLoading, 
    error, 
    pagination,
    fetchTodos, 
    clearError,
    filters 
  } = useTodos();

  // Debug logging
  console.log('showCreateModal state:', showCreateModal);

  // Fetch todos on mount and when filters change
  useEffect(() => {
    fetchTodos(1);
  }, [filters]);

  const handlePageChange = (page) => {
    fetchTodos(page);
  };

  const completedCount = todos.filter(todo => todo.completed).length;
  const activeCount = todos.filter(todo => !todo.completed).length;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  My Todos
                </h1>
                <div className="mt-2 flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                  <span>{activeCount} active</span>
                  <span>•</span>
                  <span>{completedCount} completed</span>
                  <span>•</span>
                  <span>{todos.length} total</span>
                </div>
              </div>
              
              <div className="mt-4 sm:mt-0">
                <Button onClick={() => {
                  console.log('Header New Todo button clicked!');
                  setShowCreateModal(true);
                  console.log('showCreateModal set to true from header');
                }}>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  New Todo
                </Button>
              </div>
            </div>
          </div>

          {/* Filters */}
          <TodoFilters />

          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-center justify-between">
                <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
                <button
                  onClick={clearError}
                  className="text-red-400 hover:text-red-600 dark:hover:text-red-300"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* Loading State */}
          {isLoading && todos.length === 0 && (
            <div className="flex justify-center py-12">
              <Loading />
            </div>
          )}

          {/* Empty State */}
          {!isLoading && todos.length === 0 && (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">No todos yet</h3>
              <p className="mt-1 text-gray-500 dark:text-gray-400">
                Get started by creating your first todo.
              </p>
              <div className="mt-6">
                <Button onClick={() => {
                  console.log('Create Todo button clicked!');
                  setShowCreateModal(true);
                  console.log('showCreateModal set to true');
                }}>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create Todo
                </Button>
              </div>
            </div>
          )}

          {/* Todos List */}
          {todos.length > 0 && (
            <div className="space-y-4">
              {todos.map(todo => (
                <TodoItem key={todo._id} todo={todo} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="mt-8 flex items-center justify-between">
              <div className="text-sm text-gray-700 dark:text-gray-300">
                Showing page {pagination.currentPage} of {pagination.totalPages} 
                ({pagination.totalTodos} total todos)
              </div>
              
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="small"
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={!pagination.hasPrevPage}
                >
                  Previous
                </Button>
                
                <Button
                  variant="outline"
                  size="small"
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={!pagination.hasNextPage}
                >
                  Next
                </Button>
              </div>
            </div>
          )}

          {/* Create Todo Modal */}
          <SimpleTodoForm
            isOpen={showCreateModal}
            onClose={() => setShowCreateModal(false)}
          />
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default TodosPage;
