import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SignUpForm from '../SignUpForm';
import { SignUpFormData } from '../../types/signUp.types';

// Mock the focus management utilities
jest.mock('../../utils/focusManagement', () => ({
  focusFirstInvalidField: jest.fn(),
  handleFormKeyNavigation: jest.fn(),
  announceToScreenReader: jest.fn()
}));

describe('SignUpForm Integration Tests', () => {
  let mockOnSubmit: jest.Mock;
  let mockOnReset: jest.Mock;
  let user: ReturnType<typeof userEvent.setup>;

  // Helper function to get password input (first password field)
  const getPasswordInput = () => screen.getAllByLabelText(/비밀번호/)[0];
  
  // Helper function to get confirm password input
  const getConfirmPasswordInput = () => screen.getByLabelText(/비밀번호 확인/);

  beforeEach(() => {
    mockOnSubmit = jest.fn();
    mockOnReset = jest.fn();
    user = userEvent.setup();
    
    // Mock console methods to avoid noise in tests
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
    
    // Mock alert
    global.alert = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Form Rendering and Initial State', () => {
    it('should render all form fields with correct labels', () => {
      render(<SignUpForm />);

      expect(screen.getByLabelText(/이름/)).toBeInTheDocument();
      expect(screen.getByLabelText(/이메일/)).toBeInTheDocument();
      expect(screen.getByLabelText(/^비밀번호$/)).toBeInTheDocument();
      expect(screen.getByLabelText(/비밀번호 확인/)).toBeInTheDocument();
      expect(screen.getByLabelText(/서비스 이용약관/)).toBeInTheDocument();
    });

    it('should render submit and reset buttons', () => {
      render(<SignUpForm />);

      expect(screen.getByRole('button', { name: /회원가입/ })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /초기화/ })).toBeInTheDocument();
    });

    it('should have submit button disabled initially', () => {
      render(<SignUpForm />);

      const submitButton = screen.getByRole('button', { name: /회원가입/ });
      expect(submitButton).toBeDisabled();
    });

    it('should show required asterisks for required fields', () => {
      render(<SignUpForm />);

      const requiredAsterisks = screen.getAllByText('*');
      expect(requiredAsterisks).toHaveLength(5); // All fields are required
    });

    it('should have proper accessibility attributes', () => {
      render(<SignUpForm />);

      const form = screen.getByRole('form');
      expect(form).toHaveAttribute('aria-label', '회원가입 폼');
      expect(form).toHaveAttribute('novalidate');
    });
  });

  describe('Form Field Interactions and Validation', () => {
    it('should show validation errors when fields are invalid', async () => {
      render(<SignUpForm />);

      const nameInput = screen.getByLabelText(/이름/);
      const emailInput = screen.getByLabelText(/이메일/);

      // Trigger validation by focusing and blurring
      await user.click(nameInput);
      await user.tab();
      
      await user.click(emailInput);
      await user.type(emailInput, 'invalid-email');
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText('이름은 필수 입력 항목입니다')).toBeInTheDocument();
      }, { timeout: 3000 });

      await waitFor(() => {
        expect(screen.getByText('올바른 이메일 형식을 입력해주세요')).toBeInTheDocument();
      }, { timeout: 3000 });
    });

    it('should validate name field requirements', async () => {
      render(<SignUpForm />);

      const nameInput = screen.getByLabelText(/이름/);

      // Test empty name
      await user.click(nameInput);
      await user.tab();
      
      await waitFor(() => {
        expect(screen.getByText('이름은 필수 입력 항목입니다')).toBeInTheDocument();
      });

      // Test short name
      await user.click(nameInput);
      await user.clear(nameInput);
      await user.type(nameInput, '김');
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText('이름은 최소 2자 이상이어야 합니다')).toBeInTheDocument();
      });

      // Test valid name
      await user.click(nameInput);
      await user.clear(nameInput);
      await user.type(nameInput, '김철수');
      await user.tab();

      await waitFor(() => {
        expect(screen.queryByText('이름은 최소 2자 이상이어야 합니다')).not.toBeInTheDocument();
      });
    });

    it('should validate email field requirements', async () => {
      render(<SignUpForm />);

      const emailInput = screen.getByLabelText(/이메일/);

      // Test invalid email formats
      const invalidEmails = ['invalid', '@test.com', 'test@', 'test.com'];

      for (const email of invalidEmails) {
        await user.click(emailInput);
        await user.clear(emailInput);
        await user.type(emailInput, email);
        await user.tab();

        await waitFor(() => {
          expect(screen.getByText('올바른 이메일 형식을 입력해주세요')).toBeInTheDocument();
        });
      }

      // Test valid email
      await user.click(emailInput);
      await user.clear(emailInput);
      await user.type(emailInput, 'test@example.com');
      await user.tab();

      await waitFor(() => {
        expect(screen.queryByText('올바른 이메일 형식을 입력해주세요')).not.toBeInTheDocument();
      });
    });

    it('should validate password field requirements', async () => {
      render(<SignUpForm />);

      const passwordInput = getPasswordInput();

      // Test short password
      await user.click(passwordInput);
      await user.type(passwordInput, 'short');
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText('비밀번호는 최소 8자 이상이어야 합니다')).toBeInTheDocument();
      });

      // Test password without special character
      await user.click(passwordInput);
      await user.clear(passwordInput);
      await user.type(passwordInput, 'password123');
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText('비밀번호에는 특수문자가 포함되어야 합니다')).toBeInTheDocument();
      });

      // Test valid password
      await user.click(passwordInput);
      await user.clear(passwordInput);
      await user.type(passwordInput, 'password123!');
      await user.tab();

      await waitFor(() => {
        expect(screen.queryByText('비밀번호는 최소 8자 이상이어야 합니다')).not.toBeInTheDocument();
        expect(screen.queryByText('비밀번호에는 특수문자가 포함되어야 합니다')).not.toBeInTheDocument();
      });
    });

    it('should validate password confirmation', async () => {
      render(<SignUpForm />);

      const passwordInput = getPasswordInput();
      const confirmPasswordInput = getConfirmPasswordInput();

      // Set password
      await user.type(passwordInput, 'password123!');
      
      // Test mismatched confirmation
      await user.type(confirmPasswordInput, 'different123!');
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText('비밀번호가 일치하지 않습니다')).toBeInTheDocument();
      });

      // Test matching confirmation
      await user.clear(confirmPasswordInput);
      await user.type(confirmPasswordInput, 'password123!');
      await user.tab();

      await waitFor(() => {
        expect(screen.queryByText('비밀번호가 일치하지 않습니다')).not.toBeInTheDocument();
      });
    });

    it('should validate terms agreement', async () => {
      render(<SignUpForm />);

      const termsCheckbox = screen.getByLabelText(/서비스 이용약관/);

      // Initially unchecked should show error when trying to submit
      expect(termsCheckbox).not.toBeChecked();

      // Check and uncheck to trigger validation
      await user.click(termsCheckbox);
      expect(termsCheckbox).toBeChecked();

      await user.click(termsCheckbox);
      expect(termsCheckbox).not.toBeChecked();

      await waitFor(() => {
        expect(screen.getByText('약관에 동의해주세요')).toBeInTheDocument();
      });
    });
  });

  describe('Submit Button State Management', () => {
    it('should enable submit button only when all fields are valid', async () => {
      render(<SignUpForm />);

      const submitButton = screen.getByRole('button', { name: /회원가입/ });
      expect(submitButton).toBeDisabled();

      // Fill all fields with valid data
      await user.type(screen.getByLabelText(/이름/), '홍길동');
      await user.type(screen.getByLabelText(/이메일/), 'hong@example.com');
      await user.type(screen.getByLabelText('비밀번호'), 'password123!');
      await user.type(screen.getByLabelText(/비밀번호 확인/), 'password123!');
      await user.click(screen.getByLabelText(/서비스 이용약관/));

      await waitFor(() => {
        expect(submitButton).toBeEnabled();
      });
    });

    it('should disable submit button when any field becomes invalid', async () => {
      render(<SignUpForm />);

      // Fill all fields with valid data first
      await user.type(screen.getByLabelText(/이름/), '홍길동');
      await user.type(screen.getByLabelText(/이메일/), 'hong@example.com');
      await user.type(screen.getByLabelText('비밀번호'), 'password123!');
      await user.type(screen.getByLabelText(/비밀번호 확인/), 'password123!');
      await user.click(screen.getByLabelText(/서비스 이용약관/));

      const submitButton = screen.getByRole('button', { name: /회원가입/ });
      
      await waitFor(() => {
        expect(submitButton).toBeEnabled();
      });

      // Make email invalid
      const emailInput = screen.getByLabelText(/이메일/);
      await user.clear(emailInput);
      await user.type(emailInput, 'invalid-email');

      await waitFor(() => {
        expect(submitButton).toBeDisabled();
      });
    });

    it('should show loading state during submission', async () => {
      const slowOnSubmit = jest.fn(() => new Promise(resolve => setTimeout(resolve, 100)));
      render(<SignUpForm onSubmit={slowOnSubmit} />);

      // Fill form with valid data
      await user.type(screen.getByLabelText(/이름/), '홍길동');
      await user.type(screen.getByLabelText(/이메일/), 'hong@example.com');
      await user.type(screen.getByLabelText(/^비밀번호$/), 'password123!');
      await user.type(screen.getByLabelText(/비밀번호 확인/), 'password123!');
      await user.click(screen.getByLabelText(/서비스 이용약관/));

      const submitButton = screen.getByRole('button', { name: /회원가입/ });
      await user.click(submitButton);

      expect(screen.getByText('처리 중...')).toBeInTheDocument();
      expect(submitButton).toBeDisabled();

      await waitFor(() => {
        expect(screen.getByText('회원가입')).toBeInTheDocument();
      });
    });
  });

  describe('Form Submission', () => {
    it('should call onSubmit with correct data when form is valid', async () => {
      render(<SignUpForm onSubmit={mockOnSubmit} />);

      const formData = {
        name: '홍길동',
        email: 'hong@example.com',
        password: 'password123!',
        confirmPassword: 'password123!',
        agreeToTerms: true
      };

      // Fill form
      await user.type(screen.getByLabelText(/이름/), formData.name);
      await user.type(screen.getByLabelText(/이메일/), formData.email);
      await user.type(screen.getByLabelText('비밀번호'), formData.password);
      await user.type(screen.getByLabelText(/비밀번호 확인/), formData.confirmPassword);
      await user.click(screen.getByLabelText(/서비스 이용약관/));

      // Submit form
      const submitButton = screen.getByRole('button', { name: /회원가입/ });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith(formData);
      });
    });

    it('should show success message and reset form after successful submission', async () => {
      render(<SignUpForm onSubmit={mockOnSubmit} />);

      // Fill and submit form
      await user.type(screen.getByLabelText(/이름/), '홍길동');
      await user.type(screen.getByLabelText(/이메일/), 'hong@example.com');
      await user.type(screen.getByLabelText('비밀번호'), 'password123!');
      await user.type(screen.getByLabelText(/비밀번호 확인/), 'password123!');
      await user.click(screen.getByLabelText(/서비스 이용약관/));

      const submitButton = screen.getByRole('button', { name: /회원가입/ });
      await user.click(submitButton);

      await waitFor(() => {
        expect(global.alert).toHaveBeenCalledWith('회원가입이 완료되었습니다!');
      });

      // Check form is reset
      expect(screen.getByLabelText(/이름/)).toHaveValue('');
      expect(screen.getByLabelText(/이메일/)).toHaveValue('');
      expect(screen.getByLabelText('비밀번호')).toHaveValue('');
      expect(screen.getByLabelText(/비밀번호 확인/)).toHaveValue('');
      expect(screen.getByLabelText(/서비스 이용약관/)).not.toBeChecked();
    });

    it('should handle submission errors gracefully', async () => {
      const errorOnSubmit = jest.fn().mockRejectedValue(new Error('서버 오류'));
      render(<SignUpForm onSubmit={errorOnSubmit} />);

      // Fill and submit form
      await user.type(screen.getByLabelText(/이름/), '홍길동');
      await user.type(screen.getByLabelText(/이메일/), 'hong@example.com');
      await user.type(screen.getByLabelText('비밀번호'), 'password123!');
      await user.type(screen.getByLabelText(/비밀번호 확인/), 'password123!');
      await user.click(screen.getByLabelText(/서비스 이용약관/));

      const submitButton = screen.getByRole('button', { name: /회원가입/ });
      await user.click(submitButton);

      await waitFor(() => {
        expect(global.alert).toHaveBeenCalledWith('서버 오류');
      });
    });

    it('should not submit when form is invalid', async () => {
      render(<SignUpForm onSubmit={mockOnSubmit} />);

      // Fill form with invalid data
      await user.type(screen.getByLabelText(/이름/), '김'); // Too short
      await user.type(screen.getByLabelText(/이메일/), 'invalid-email');

      const submitButton = screen.getByRole('button', { name: /회원가입/ });
      expect(submitButton).toBeDisabled();

      // Try to submit (should not work)
      fireEvent.click(submitButton);

      expect(mockOnSubmit).not.toHaveBeenCalled();
    });
  });

  describe('Form Reset Functionality', () => {
    it('should reset all fields when reset button is clicked', async () => {
      render(<SignUpForm onReset={mockOnReset} />);

      // Fill form with data
      await user.type(screen.getByLabelText(/이름/), '홍길동');
      await user.type(screen.getByLabelText(/이메일/), 'hong@example.com');
      await user.type(screen.getByLabelText(/^비밀번호$/), 'password123!');
      await user.type(screen.getByLabelText(/비밀번호 확인/), 'password123!');
      await user.click(screen.getByLabelText(/서비스 이용약관/));

      // Click reset button
      const resetButton = screen.getByRole('button', { name: /초기화/ });
      await user.click(resetButton);

      // Check all fields are cleared
      expect(screen.getByLabelText(/이름/)).toHaveValue('');
      expect(screen.getByLabelText(/이메일/)).toHaveValue('');
      expect(screen.getByLabelText(/^비밀번호$/)).toHaveValue('');
      expect(screen.getByLabelText(/비밀번호 확인/)).toHaveValue('');
      expect(screen.getByLabelText(/서비스 이용약관/)).not.toBeChecked();

      expect(mockOnReset).toHaveBeenCalled();
    });

    it('should clear all error messages when reset', async () => {
      render(<SignUpForm />);

      // Trigger some validation errors
      const nameInput = screen.getByLabelText(/이름/);
      await user.click(nameInput);
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText('이름은 필수 입력 항목입니다')).toBeInTheDocument();
      });

      // Reset form
      const resetButton = screen.getByRole('button', { name: /초기화/ });
      await user.click(resetButton);

      // Check error messages are cleared
      expect(screen.queryByText('이름은 필수 입력 항목입니다')).not.toBeInTheDocument();
    });

    it('should disable submit button after reset', async () => {
      render(<SignUpForm />);

      // Fill form to enable submit button
      await user.type(screen.getByLabelText(/이름/), '홍길동');
      await user.type(screen.getByLabelText(/이메일/), 'hong@example.com');
      await user.type(screen.getByLabelText('비밀번호'), 'password123!');
      await user.type(screen.getByLabelText(/비밀번호 확인/), 'password123!');
      await user.click(screen.getByLabelText(/서비스 이용약관/));

      const submitButton = screen.getByRole('button', { name: /회원가입/ });
      
      await waitFor(() => {
        expect(submitButton).toBeEnabled();
      });

      // Reset form
      const resetButton = screen.getByRole('button', { name: /초기화/ });
      await user.click(resetButton);

      // Submit button should be disabled
      expect(submitButton).toBeDisabled();
    });
  });

  describe('Complete User Signup Flow Scenarios', () => {
    it('should complete successful signup flow', async () => {
      render(<SignUpForm onSubmit={mockOnSubmit} />);

      // Step 1: Fill name
      await user.type(screen.getByLabelText(/이름/), '홍길동');
      
      // Step 2: Fill email
      await user.type(screen.getByLabelText(/이메일/), 'hong@example.com');
      
      // Step 3: Fill password
      await user.type(screen.getByLabelText('비밀번호'), 'securePass123!');
      
      // Step 4: Confirm password
      await user.type(screen.getByLabelText(/비밀번호 확인/), 'securePass123!');
      
      // Step 5: Agree to terms
      await user.click(screen.getByLabelText(/서비스 이용약관/));

      // Step 6: Submit form
      const submitButton = screen.getByRole('button', { name: /회원가입/ });
      
      await waitFor(() => {
        expect(submitButton).toBeEnabled();
      });

      await user.click(submitButton);

      // Verify submission
      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          name: '홍길동',
          email: 'hong@example.com',
          password: 'securePass123!',
          confirmPassword: 'securePass123!',
          agreeToTerms: true
        });
        expect(global.alert).toHaveBeenCalledWith('회원가입이 완료되었습니다!');
      });
    });

    it('should handle error correction flow', async () => {
      render(<SignUpForm />);

      // Step 1: Fill form with some errors
      await user.type(screen.getByLabelText(/이름/), '김'); // Too short
      await user.type(screen.getByLabelText(/이메일/), 'invalid-email');
      await user.type(screen.getByLabelText('비밀번호'), 'short'); // Too short
      await user.type(screen.getByLabelText(/비밀번호 확인/), 'different');

      // Step 2: Verify errors are shown
      await user.tab(); // Trigger validation
      
      await waitFor(() => {
        expect(screen.getByText('이름은 최소 2자 이상이어야 합니다')).toBeInTheDocument();
        expect(screen.getByText('올바른 이메일 형식을 입력해주세요')).toBeInTheDocument();
        expect(screen.getByText('비밀번호는 최소 8자 이상이어야 합니다')).toBeInTheDocument();
      });

      // Step 3: Correct the errors
      await user.clear(screen.getByLabelText(/이름/));
      await user.type(screen.getByLabelText(/이름/), '김철수');

      await user.clear(screen.getByLabelText(/이메일/));
      await user.type(screen.getByLabelText(/이메일/), 'kim@example.com');

      await user.clear(screen.getByLabelText('비밀번호'));
      await user.type(screen.getByLabelText('비밀번호'), 'password123!');

      await user.clear(screen.getByLabelText(/비밀번호 확인/));
      await user.type(screen.getByLabelText(/비밀번호 확인/), 'password123!');

      await user.click(screen.getByLabelText(/서비스 이용약관/));

      // Step 4: Verify errors are cleared and submit is enabled
      await waitFor(() => {
        expect(screen.queryByText('이름은 최소 2자 이상이어야 합니다')).not.toBeInTheDocument();
        expect(screen.queryByText('올바른 이메일 형식을 입력해주세요')).not.toBeInTheDocument();
        expect(screen.queryByText('비밀번호는 최소 8자 이상이어야 합니다')).not.toBeInTheDocument();
        expect(screen.getByRole('button', { name: /회원가입/ })).toBeEnabled();
      });
    });

    it('should handle reset and re-entry flow', async () => {
      render(<SignUpForm />);

      // Step 1: Fill form partially
      await user.type(screen.getByLabelText(/이름/), '홍길동');
      await user.type(screen.getByLabelText(/이메일/), 'hong@example.com');

      // Step 2: Reset form
      await user.click(screen.getByRole('button', { name: /초기화/ }));

      // Step 3: Verify form is cleared
      expect(screen.getByLabelText(/이름/)).toHaveValue('');
      expect(screen.getByLabelText(/이메일/)).toHaveValue('');

      // Step 4: Re-enter data
      await user.type(screen.getByLabelText(/이름/), '김철수');
      await user.type(screen.getByLabelText(/이메일/), 'kim@example.com');
      await user.type(screen.getByLabelText('비밀번호'), 'newPassword123!');
      await user.type(screen.getByLabelText(/비밀번호 확인/), 'newPassword123!');
      await user.click(screen.getByLabelText(/서비스 이용약관/));

      // Step 5: Verify form is valid and can be submitted
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /회원가입/ })).toBeEnabled();
      });
    });
  });

  describe('Keyboard Navigation and Accessibility', () => {
    it('should support keyboard navigation between fields', async () => {
      render(<SignUpForm />);

      const nameInput = screen.getByLabelText(/이름/);
      const emailInput = screen.getByLabelText(/이메일/);

      // Focus first field
      nameInput.focus();
      expect(nameInput).toHaveFocus();

      // Tab to next field
      await user.tab();
      expect(emailInput).toHaveFocus();
    });

    it('should have proper ARIA attributes for screen readers', () => {
      render(<SignUpForm />);

      // Check form has proper ARIA attributes
      const form = screen.getByRole('form');
      expect(form).toHaveAttribute('aria-label', '회원가입 폼');

      // Check error messages have proper ARIA attributes
      const nameInput = screen.getByLabelText(/이름/);
      expect(nameInput).toHaveAttribute('aria-invalid', 'false');
    });

    it('should update ARIA attributes when validation errors occur', async () => {
      render(<SignUpForm />);

      const nameInput = screen.getByLabelText(/이름/);
      
      // Trigger validation error
      await user.click(nameInput);
      await user.tab();

      await waitFor(() => {
        expect(nameInput).toHaveAttribute('aria-invalid', 'true');
        expect(nameInput).toHaveAttribute('aria-describedby');
      });
    });
  });
});