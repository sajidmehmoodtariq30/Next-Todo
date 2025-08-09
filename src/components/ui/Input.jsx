const Input = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  label,
  required = false,
  disabled = false,
  className = '',
  ...props
}) => {
  const baseClasses = 'block w-full px-3 py-2 border rounded-lg text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1';
  
  const stateClasses = error 
    ? 'border-red-300 dark:border-red-600 focus:border-red-500 focus:ring-red-500 bg-red-50 dark:bg-red-900/10'
    : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 bg-white dark:bg-gray-800';
    
  const disabledClasses = disabled 
    ? 'opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-700'
    : '';

  const classes = `
    ${baseClasses}
    ${stateClasses}
    ${disabledClasses}
    text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400
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
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={classes}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
};

export default Input;
