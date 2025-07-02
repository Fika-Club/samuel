import React, { useState } from 'react';
import { FormFieldProps } from '../types/signUp.types';
import ErrorMessage from './ErrorMessage';

const FormField: React.FC<FormFieldProps> = ({
  name,
  label,
  type = 'text',
  register,
  error,
  placeholder,
  required = false,
  className = ''
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);
  
  const fieldId = `field-${name}`;
  const errorId = `error-${name}`;
  const hasError = !!error;
  
  // Determine field state classes
  const fieldClasses = [
    'form-field',
    className,
    hasError ? 'has-error' : '',
    !hasError && hasValue ? 'is-valid' : '',
    isFocused ? 'is-focused' : ''
  ].filter(Boolean).join(' ');

  if (type === 'checkbox') {
    return (
      <div className={fieldClasses}>
        <div className={`checkbox-container ${hasError ? 'has-error' : ''}`}>
          <input
            id={fieldId}
            type="checkbox"
            aria-describedby={hasError ? errorId : undefined}
            aria-invalid={hasError}
            {...register(name, {
              onChange: (e) => setHasValue(e.target.checked)
            })}
          />
          <label 
            htmlFor={fieldId} 
            className="checkbox-label"
          >
            {label}
            {required && <span className="required-asterisk">*</span>}
          </label>
        </div>
        <ErrorMessage 
          message={error?.message} 
          visible={hasError}
        />
      </div>
    );
  }

  return (
    <div className={fieldClasses}>
      <label htmlFor={fieldId}>
        {label}
        {required && <span className="required-asterisk">*</span>}
      </label>
      <input
        id={fieldId}
        type={type}
        placeholder={placeholder}
        aria-describedby={hasError ? errorId : undefined}
        aria-invalid={hasError}
        autoComplete={getAutoComplete(name)}
        {...register(name, {
          onChange: (e) => {
            setHasValue(e.target.value.length > 0);
          }
        })}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      <ErrorMessage 
        message={error?.message} 
        visible={hasError}
      />
    </div>
  );
};

// Helper function to set appropriate autocomplete attributes
const getAutoComplete = (fieldName: string): string => {
  const autoCompleteMap: Record<string, string> = {
    name: 'name',
    email: 'email',
    password: 'new-password',
    confirmPassword: 'new-password'
  };
  
  return autoCompleteMap[fieldName] || 'off';
};

export default FormField;