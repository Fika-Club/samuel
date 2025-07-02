import React from 'react';
import SignUpForm from './components/SignUpForm';
import { SignUpFormData } from './types/signUp.types';

/**
 * Main App Component
 * Demonstrates the SignUpForm component with form submission handling
 */
const App: React.FC = () => {
  // Handle form submission
  const handleSubmit = async (data: SignUpFormData) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate potential API error (uncomment to test error handling)
    // throw new Error('서버 오류가 발생했습니다.');
    
    console.log('API 호출 성공:', data);
  };

  // Handle form reset
  const handleReset = () => {
    console.log('폼이 초기화되었습니다.');
  };

  return (
    <div style={{ 
      maxWidth: '500px', 
      margin: '2rem auto', 
      padding: '2rem',
      fontFamily: 'Arial, sans-serif'
    }}>
      <SignUpForm 
        onSubmit={handleSubmit}
        onReset={handleReset}
      />
    </div>
  );
};

export default App;