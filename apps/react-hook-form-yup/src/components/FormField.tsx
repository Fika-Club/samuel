import React from 'react';
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
  const fieldId = `field-${name}`;
  const errorId = `error-${name}`;
  const hasError = !!error;

  const baseInputStyles = {
    width: '100%',
    padding: '0.75rem',
    border: `2px solid ${hasError ? '#dc3545' : '#e1e5e9'}`,
    borderRadius: '0.375rem',
    fontSize: '1rem',
    lineHeight: '1.5',
    transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
    outline: 'none'
  };

  const focusStyles = {
    borderColor: hasError ? '#dc3545' : '#0d6efd',
    boxShadow: hasError 
      ? '0 0 0 0.2rem rgba(220, 53, 69, 0.25)' 
      : '0 0 0 0.2rem rgba(13, 110, 253, 0.25)'
  };

  const labelStyles = {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: '500',
    color: '#212529',
    fontSize: '0.875rem'
  };

  const checkboxContainerStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  };

  const checkboxStyles = {
    width: '1rem',
    height: '1rem',
    cursor: 'pointer'
  };

  const checkboxLabelStyles = {
    ...labelStyles,
    marginBottom: '0',
    cursor: 'pointer',
    fontSize: '0.875rem'
  };

  if (type === 'checkbox') {
    return (
      <div className={`form-field ${className}`} style={{ marginBottom: '1rem' }}>
        <div style={checkboxContainerStyles}>
          <input
            id={fieldId}
            type="checkbox"
            style={checkboxStyles}
            aria-describedby={hasError ? errorId : undefined}
            aria-invalid={hasError}
            {...register(name)}
          />
          <label 
            htmlFor={fieldId} 
            style={checkboxLabelStyles}
          >
            {label}
            {required && <span style={{ color: '#dc3545', marginLeft: '0.25rem' }}>*</span>}
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
    <div className={`form-field ${className}`} style={{ marginBottom: '1rem' }}>
      <label 
        htmlFor={fieldId} 
        style={labelStyles}
      >
        {label}
        {required && <span style={{ color: '#dc3545', marginLeft: '0.25rem' }}>*</span>}
      </label>
      <input
        id={fieldId}
        type={type}
        placeholder={placeholder}
        style={baseInputStyles}
        aria-describedby={hasError ? errorId : undefined}
        aria-invalid={hasError}
        onFocus={(e) => {
          Object.assign(e.target.style, focusStyles);
        }}
        onBlur={(e) => {
          e.target.style.borderColor = hasError ? '#dc3545' : '#e1e5e9';
          e.target.style.boxShadow = 'none';
        }}
        {...register(name)}
      />
      <ErrorMessage 
        message={error?.message} 
        visible={hasError}
      />
    </div>
  );
};

export default FormField;