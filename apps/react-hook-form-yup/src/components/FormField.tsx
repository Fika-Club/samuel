import React from 'react';
import { UseFormRegister, FieldError } from 'react-hook-form';
import ErrorMessage from './ErrorMessage';

interface FormFieldProps {
  name: string;
  label: string;
  type?: 'text' | 'email' | 'password' | 'checkbox';
  register: UseFormRegister<any>;
  error?: FieldError;
  placeholder?: string;
  required?: boolean;
}

const FormField: React.FC<FormFieldProps> = ({
  name,
  label,
  type = 'text',
  register,
  error,
  placeholder,
  required = false
}) => {
  const fieldId = `field-${name}`;
  const errorId = `error-${name}`;

  const inputStyles = {
    width: '100%',
    padding: '0.75rem',
    border: `1px solid ${error ? '#dc3545' : '#ced4da'}`,
    borderRadius: '0.375rem',
    fontSize: '1rem',
    lineHeight: '1.5',
    transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
    outline: 'none'
  };

  const labelStyles = {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: '500',
    color: '#212529',
    fontSize: '0.875rem'
  };

  const fieldContainerStyles = {
    marginBottom: '1rem'
  };

  const checkboxContainerStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  };

  const checkboxStyles = {
    width: 'auto',
    margin: '0'
  };

  if (type === 'checkbox') {
    return (
      <div style={fieldContainerStyles}>
        <div style={checkboxContainerStyles}>
          <input
            id={fieldId}
            type="checkbox"
            style={checkboxStyles}
            aria-describedby={error ? errorId : undefined}
            aria-invalid={error ? 'true' : 'false'}
            {...register(name)}
          />
          <label htmlFor={fieldId} style={labelStyles}>
            {label}
            {required && <span style={{ color: '#dc3545' }}> *</span>}
          </label>
        </div>
        <ErrorMessage 
          message={error?.message} 
          visible={!!error}
        />
      </div>
    );
  }

  return (
    <div style={fieldContainerStyles}>
      <label htmlFor={fieldId} style={labelStyles}>
        {label}
        {required && <span style={{ color: '#dc3545' }}> *</span>}
      </label>
      <input
        id={fieldId}
        type={type}
        placeholder={placeholder}
        style={inputStyles}
        aria-describedby={error ? errorId : undefined}
        aria-invalid={error ? 'true' : 'false'}
        {...register(name)}
      />
      <ErrorMessage 
        message={error?.message} 
        visible={!!error}
      />
    </div>
  );
};

export default FormField;