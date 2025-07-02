import React from 'react';

interface ErrorMessageProps {
  message?: string;
  visible: boolean;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, visible }) => {
  if (!visible || !message) {
    return null;
  }

  return (
    <span 
      className="error-message"
      role="alert"
      aria-live="polite"
      style={{
        color: '#dc3545',
        fontSize: '0.875rem',
        marginTop: '0.25rem',
        display: 'block',
        lineHeight: '1.4'
      }}
    >
      {message}
    </span>
  );
};

export default ErrorMessage;