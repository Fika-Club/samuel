import React from 'react';
import SignUpForm from './components/SignUpForm';
import { SignUpFormData } from './types/signUp.types';
import './styles/SignUpForm.css';

/**
 * App Component
 * Main application wrapper that renders the SignUpForm component
 */
const App: React.FC = () => {
  // Handle successful form submission
  const handleSubmit = (data: SignUpFormData) => {
    console.log('App received form data:', data);
    // Additional processing can be added here
  };

  // Handle form reset
  const handleReset = () => {
    console.log('App received form reset');
    // Additional reset logic can be added here
  };

  return (
    <div className="app">
      <div className="app-container">
        <div className="app-content">
          <header className="app-header">
            <h1>React Hook Form + Yup</h1>
            <p>회원가입 폼 예제</p>
          </header>
          
          <main className="app-main">
            <SignUpForm 
              onSubmit={handleSubmit}
              onReset={handleReset}
            />
          </main>
        </div>
      </div>
    </div>
  );
};

export default App;