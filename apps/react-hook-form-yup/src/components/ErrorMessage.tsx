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
    >
      {message}
    </span>
  );
};

export default ErrorMessage;