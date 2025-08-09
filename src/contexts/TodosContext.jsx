"use client";

import { createContext, useContext, useReducer, useCallback } from 'react';

// Todos Context
const TodosContext = createContext();

// Actions
const TODOS_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_TODOS: 'SET_TODOS',
  ADD_TODO: 'ADD_TODO',
  UPDATE_TODO: 'UPDATE_TODO',
  DELETE_TODO: 'DELETE_TODO',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_FILTERS: 'SET_FILTERS',
  SET_PAGINATION: 'SET_PAGINATION'
};

// Initial State
const initialState = {
  todos: [],
  isLoading: false,
  error: null,
  filters: {
    completed: null,
    priority: '',
    category: '',
    search: ''
  },
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalTodos: 0,
    hasNextPage: false,
    hasPrevPage: false
  }
};

// Reducer
function todosReducer(state, action) {
  switch (action.type) {
    case TODOS_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload
      };
    case TODOS_ACTIONS.SET_TODOS:
      return {
        ...state,
        todos: action.payload,
        isLoading: false,
        error: null
      };
    case TODOS_ACTIONS.ADD_TODO:
      return {
        ...state,
        todos: [action.payload, ...state.todos]
      };
    case TODOS_ACTIONS.UPDATE_TODO:
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo._id === action.payload._id ? action.payload : todo
        )
      };
    case TODOS_ACTIONS.DELETE_TODO:
      return {
        ...state,
        todos: state.todos.filter(todo => todo._id !== action.payload)
      };
    case TODOS_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };
    case TODOS_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };
    case TODOS_ACTIONS.SET_FILTERS:
      return {
        ...state,
        filters: { ...state.filters, ...action.payload }
      };
    case TODOS_ACTIONS.SET_PAGINATION:
      return {
        ...state,
        pagination: action.payload
      };
    default:
      return state;
  }
}

// Todos Provider
export function TodosProvider({ children }) {
  const [state, dispatch] = useReducer(todosReducer, initialState);

  // Fetch todos with filters
  const fetchTodos = useCallback(async (page = 1) => {
    try {
      dispatch({ type: TODOS_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: TODOS_ACTIONS.CLEAR_ERROR });

      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10'
      });

      // Add filters to params
      if (state.filters.completed !== null) {
        params.append('completed', state.filters.completed.toString());
      }
      if (state.filters.priority) {
        params.append('priority', state.filters.priority);
      }
      if (state.filters.category) {
        params.append('category', state.filters.category);
      }

      const response = await fetch(`/api/todos?${params.toString()}`, {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        dispatch({ type: TODOS_ACTIONS.SET_TODOS, payload: data.todos });
        dispatch({ type: TODOS_ACTIONS.SET_PAGINATION, payload: data.pagination });
      } else {
        const errorData = await response.json();
        dispatch({ type: TODOS_ACTIONS.SET_ERROR, payload: errorData.error });
      }
    } catch (error) {
      dispatch({ type: TODOS_ACTIONS.SET_ERROR, payload: 'Failed to fetch todos' });
    } finally {
      dispatch({ type: TODOS_ACTIONS.SET_LOADING, payload: false });
    }
  }, [state.filters]);

  // Create new todo
  const createTodo = async (todoData) => {
    try {
      dispatch({ type: TODOS_ACTIONS.CLEAR_ERROR });

      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(todoData),
      });

      const data = await response.json();

      if (response.ok) {
        dispatch({ type: TODOS_ACTIONS.ADD_TODO, payload: data.todo });
        return { success: true, todo: data.todo };
      } else {
        dispatch({ type: TODOS_ACTIONS.SET_ERROR, payload: data.error });
        return { success: false, error: data.error };
      }
    } catch (error) {
      const errorMessage = 'Failed to create todo';
      dispatch({ type: TODOS_ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  // Update todo
  const updateTodo = async (todoId, updates) => {
    try {
      dispatch({ type: TODOS_ACTIONS.CLEAR_ERROR });

      const response = await fetch(`/api/todos/${todoId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(updates),
      });

      const data = await response.json();

      if (response.ok) {
        dispatch({ type: TODOS_ACTIONS.UPDATE_TODO, payload: data.todo });
        return { success: true, todo: data.todo };
      } else {
        dispatch({ type: TODOS_ACTIONS.SET_ERROR, payload: data.error });
        return { success: false, error: data.error };
      }
    } catch (error) {
      const errorMessage = 'Failed to update todo';
      dispatch({ type: TODOS_ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  // Delete todo
  const deleteTodo = async (todoId) => {
    try {
      dispatch({ type: TODOS_ACTIONS.CLEAR_ERROR });

      const response = await fetch(`/api/todos/${todoId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        dispatch({ type: TODOS_ACTIONS.DELETE_TODO, payload: todoId });
        return { success: true };
      } else {
        const data = await response.json();
        dispatch({ type: TODOS_ACTIONS.SET_ERROR, payload: data.error });
        return { success: false, error: data.error };
      }
    } catch (error) {
      const errorMessage = 'Failed to delete todo';
      dispatch({ type: TODOS_ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  // Toggle todo completion
  const toggleTodoComplete = async (todoId, completed) => {
    return updateTodo(todoId, { completed });
  };

  // Set filters
  const setFilters = (newFilters) => {
    dispatch({ type: TODOS_ACTIONS.SET_FILTERS, payload: newFilters });
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: TODOS_ACTIONS.CLEAR_ERROR });
  };

  const value = {
    ...state,
    fetchTodos,
    createTodo,
    updateTodo,
    deleteTodo,
    toggleTodoComplete,
    setFilters,
    clearError
  };

  return (
    <TodosContext.Provider value={value}>
      {children}
    </TodosContext.Provider>
  );
}

// Custom hook
export function useTodos() {
  const context = useContext(TodosContext);
  if (!context) {
    throw new Error('useTodos must be used within a TodosProvider');
  }
  return context;
}
