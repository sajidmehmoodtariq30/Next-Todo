const Select = ({
  options = [],
  value,
  onChange,
  placeholder = 'Select an option',
  error,
  label,
  required = false,
  disabled = false,
  className = '',
  ...props
}) => {
  const baseClasses = 'block w-full px-3 py-2 border rounded-lg text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 appearance-none';
  
  const stateClasses = error 
    ? 'border-red-300 dark:border-red-600 focus:border-red-500 focus:ring-red-500 bg-red-50 dark:bg-red-900/10'
    : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 bg-white dark:bg-gray-800';
    
  const disabledClasses = disabled 
    ? 'opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-700'
    : 'cursor-pointer';

  const classes = `
    ${baseClasses}
    ${stateClasses}
    ${disabledClasses}
    text-gray-900 dark:text-white
    ${className}
  `.trim();

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={classes}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
};

export default Select;
