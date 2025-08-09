"use client";

import { useTodos } from '@/contexts/TodosContext';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';

const TodoFilters = () => {
  const { filters, setFilters } = useTodos();

  const handleFilterChange = (filterName, value) => {
    setFilters({ [filterName]: value });
  };

  const clearFilters = () => {
    setFilters({
      completed: null,
      priority: '',
      category: '',
      search: ''
    });
  };

  const completedOptions = [
    { value: '', label: 'All Tasks' },
    { value: 'false', label: 'Active' },
    { value: 'true', label: 'Completed' }
  ];

  const priorityOptions = [
    { value: '', label: 'All Priorities' },
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' }
  ];

  const categoryOptions = [
    { value: '', label: 'All Categories' },
    { value: 'general', label: 'General' },
    { value: 'work', label: 'Work' },
    { value: 'personal', label: 'Personal' },
    { value: 'shopping', label: 'Shopping' },
    { value: 'health', label: 'Health' },
    { value: 'education', label: 'Education' }
  ];

  const hasActiveFilters = filters.completed !== null || filters.priority || filters.category;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-0">
          <input
            type="text"
            placeholder="Search todos..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:border-blue-500 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Select
            options={completedOptions}
            value={filters.completed === null ? '' : filters.completed.toString()}
            onChange={(e) => handleFilterChange('completed', e.target.value === '' ? null : e.target.value === 'true')}
            placeholder="Status"
            className="min-w-[120px]"
          />

          <Select
            options={priorityOptions}
            value={filters.priority}
            onChange={(e) => handleFilterChange('priority', e.target.value)}
            placeholder="Priority"
            className="min-w-[120px]"
          />

          <Select
            options={categoryOptions}
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            placeholder="Category"
            className="min-w-[130px]"
          />

          {hasActiveFilters && (
            <Button
              variant="outline"
              size="small"
              onClick={clearFilters}
              className="whitespace-nowrap"
            >
              Clear Filters
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TodoFilters;
