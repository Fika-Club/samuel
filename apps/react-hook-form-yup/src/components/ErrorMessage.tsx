import React, { memo } from 'react';

interface ErrorMessageProps {
  message?: string;
  visible: boolean;
}

const ErrorMessage: React.FC<ErrorMessageProps> = memo(({ message, visible }) => {
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
});

ErrorMessage.displayName = 'ErrorMessage';

export default ErrorMessage;