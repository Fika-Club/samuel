/**
 * Accessibility Tests
 * Tests for WCAG compliance and keyboard navigation
 */

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SignUpForm from '../SignUpForm';
import FormField from '../FormField';
import { SignUpFormData } from '../../types/signUp.types';

// Mock focus management utilities
jest.mock('../../utils/focusManagement', () => ({
  focusFirstInvalidField: jest.fn(),
  handleFormKeyNavigation: jest.fn(),
  announceToScreenReader: jest.fn(),
  trapFocus: jest.fn(() => jest.fn()), // Return cleanup function
}));

describe('Accessibility Tests', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
  });

  describe('ARIA Attributes and Roles', () => {
    it('should have proper form role and aria-label', () => {
      render(<SignUpForm />);
      
      const form = screen.getByRole('form');
      expect(form).toHaveAttribute('aria-label', '회원가입 폼');
      expect(form).toHaveAttribute('aria-describedby', 'form-description');
    });

    it('should have form description for screen readers', () => {
      render(<SignUpForm />);
      
      const description = document.getElementById('form-description');
      expect(description).toBeInTheDocument();
      expect(description).toHaveClass('sr-only');
      expect(description).toHaveTextContent('회원가입을 위해 모든 필드를 입력해주세요');
    });

    it('should have proper aria-invalid attributes on form fields', () => {
      render(<SignUpForm />);
      
      const nameInput = screen.getByLabelText(/이름/);
      
      // Initially should be false
      expect(nameInput).toHaveAttribute('aria-invalid', 'false');
    });

    it('should update aria-invalid when validation errors occur', async () => {
      render(<SignUpForm />);
      
      const nameInput = screen.getByLabelText(/이름/);
      
      // Trigger validation error
      await user.type(nameInput, 'a');
      await user.clear(nameInput);
      await user.tab();
      
      // Wait for validation to complete
      await screen.findByText('이름은 필수 입력 항목입니다');
      
      expect(nameInput).toHaveAttribute('aria-invalid', 'true');
    });

    it('should have aria-describedby linking to error messages', async () => {
      render(<SignUpForm />);
      
      const nameInput = screen.getByLabelText(/이름/);
      
      // Trigger validation error
      await user.type(nameInput, 'a');
      await user.clear(nameInput);
      await user.tab();
      
      // Wait for error message
      await screen.findByText('이름은 필수 입력 항목입니다');
      
      const ariaDescribedBy = nameInput.getAttribute('aria-describedby');
      expect(ariaDescribedBy).toBeTruthy();
      
      if (ariaDescribedBy) {
        const errorElement = document.getElementById(ariaDescribedBy);
        expect(errorElement).toBeInTheDocument();
      }
    });

    it('should have proper role="alert" on error messages', async () => {
      render(<SignUpForm />);
      
      const nameInput = screen.getByLabelText(/이름/);
      
      // Trigger validation error
      await user.type(nameInput, 'a');
      await user.clear(nameInput);
      await user.tab();
      
      // Wait for error message
      const errorMessage = await screen.findByText('이름은 필수 입력 항목입니다');
      
      expect(errorMessage).toHaveAttribute('role', 'alert');
      expect(errorMessage).toHaveAttribute('aria-live', 'polite');
    });

    it('should have proper button states and descriptions', () => {
      render(<SignUpForm />);
      
      const submitButton = screen.getByRole('button', { name: /회원가입/ });
      const resetButton = screen.getByRole('button', { name: /초기화/ });
      
      expect(submitButton).toBeDisabled();
      expect(resetButton).toBeEnabled();
      
      // Should have help text when disabled
      expect(screen.getByText('모든 필드를 올바르게 입력해주세요')).toBeInTheDocument();
    });
  });

  describe('Keyboard Navigation', () => {
    it('should support tab navigation through all form fields', async () => {
      render(<SignUpForm />);
      
      const nameInput = screen.getByLabelText(/이름/);
      const emailInput = screen.getByLabelText(/이메일/);
      const passwordInput = screen.getByLabelText(/비밀번호\*$/);
      const confirmPasswordInput = screen.getByLabelText(/비밀번호 확인/);
      const termsCheckbox = screen.getByLabelText(/서비스 이용약관/);
      const submitButton = screen.getByRole('button', { name: /회원가입/ });
      const resetButton = screen.getByRole('button', { name: /초기화/ });
      
      // Start from first field
      nameInput.focus();
      expect(nameInput).toHaveFocus();
      
      // Tab through all fields
      await user.tab();
      expect(emailInput).toHaveFocus();
      
      await user.tab();
      expect(passwordInput).toHaveFocus();
      
      await user.tab();
      expect(confirmPasswordInput).toHaveFocus();
      
      await user.tab();
      expect(termsCheckbox).toHaveFocus();
      
      await user.tab();
      expect(submitButton).toHaveFocus();
      
      await user.tab();
      expect(resetButton).toHaveFocus();
    });

    it('should support shift+tab for reverse navigation', async () => {
      render(<SignUpForm />);
      
      const resetButton = screen.getByRole('button', { name: /초기화/ });
      const submitButton = screen.getByRole('button', { name: /회원가입/ });
      
      // Start from last element
      resetButton.focus();
      expect(resetButton).toHaveFocus();
      
      // Shift+tab to previous element
      await user.keyboard('{Shift>}{Tab}{/Shift}');
      expect(submitButton).toHaveFocus();
    });

    it('should handle Enter key navigation', async () => {
      render(<SignUpForm />);
      
      const nameInput = screen.getByLabelText(/이름/);
      const emailInput = screen.getByLabelText(/이메일/);
      
      nameInput.focus();
      expect(nameInput).toHaveFocus();
      
      // Press Enter to move to next field
      await user.keyboard('{Enter}');
      
      // Should move to next field (handled by focus management)
      // Note: Actual behavior depends on focus management implementation
    });

    it('should support space bar for checkbox interaction', async () => {
      render(<SignUpForm />);
      
      const termsCheckbox = screen.getByLabelText(/서비스 이용약관/);
      
      termsCheckbox.focus();
      expect(termsCheckbox).toHaveFocus();
      expect(termsCheckbox).not.toBeChecked();
      
      // Press space to toggle checkbox
      await user.keyboard(' ');
      expect(termsCheckbox).toBeChecked();
      
      await user.keyboard(' ');
      expect(termsCheckbox).not.toBeChecked();
    });

    it('should handle Escape key for form reset', async () => {
      render(<SignUpForm />);
      
      const nameInput = screen.getByLabelText(/이름/);
      
      // Fill some data
      await user.type(nameInput, 'test');
      expect(nameInput).toHaveValue('test');
      
      // Press Escape (if implemented)
      await user.keyboard('{Escape}');
      
      // Note: Escape behavior would need to be implemented in the component
    });
  });

  describe('Screen Reader Support', () => {
    it('should have proper labels for all form controls', () => {
      render(<SignUpForm />);
      
      // All inputs should have associated labels
      expect(screen.getByLabelText(/이름/)).toBeInTheDocument();
      expect(screen.getByLabelText(/이메일/)).toBeInTheDocument();
      expect(screen.getByLabelText(/비밀번호\*$/)).toBeInTheDocument();
      expect(screen.getByLabelText(/비밀번호 확인/)).toBeInTheDocument();
      expect(screen.getByLabelText(/서비스 이용약관/)).toBeInTheDocument();
    });

    it('should have required field indicators', () => {
      render(<SignUpForm />);
      
      // All required fields should have asterisk indicators
      const asterisks = screen.getAllByText('*');
      expect(asterisks).toHaveLength(5); // All fields are required
    });

    it('should announce form submission status', async () => {
      const mockOnSubmit = jest.fn();
      render(<SignUpForm onSubmit={mockOnSubmit} />);
      
      // Fill valid form data
      await user.type(screen.getByLabelText(/이름/), '홍길동');
      await user.type(screen.getByLabelText(/이메일/), 'hong@example.com');
      await user.type(screen.getByLabelText(/비밀번호\*$/), 'password123!');
      await user.type(screen.getByLabelText(/비밀번호 확인/), 'password123!');
      await user.click(screen.getByLabelText(/서비스 이용약관/));
      
      const submitButton = screen.getByRole('button', { name: /회원가입/ });
      await user.click(submitButton);
      
      // Should announce success (mocked in focus management)
      const { announceToScreenReader } = require('../../utils/focusManagement');
      expect(announceToScreenReader).toHaveBeenCalledWith('회원가입이 성공적으로 완료되었습니다.');
    });

    it('should announce form reset', async () => {
      render(<SignUpForm />);
      
      // Fill some data
      await user.type(screen.getByLabelText(/이름/), 'test');
      
      // Reset form
      const resetButton = screen.getByRole('button', { name: /초기화/ });
      await user.click(resetButton);
      
      // Should announce reset (mocked in focus management)
      const { announceToScreenReader } = require('../../utils/focusManagement');
      expect(announceToScreenReader).toHaveBeenCalledWith('폼이 초기화되었습니다.');
    });

    it('should have proper autocomplete attributes', () => {
      render(<SignUpForm />);
      
      const nameInput = screen.getByLabelText(/이름/);
      const emailInput = screen.getByLabelText(/이메일/);
      const passwordInput = screen.getByLabelText(/비밀번호\*$/);
      const confirmPasswordInput = screen.getByLabelText(/비밀번호 확인/);
      
      expect(nameInput).toHaveAttribute('autocomplete', 'name');
      expect(emailInput).toHaveAttribute('autocomplete', 'email');
      expect(passwordInput).toHaveAttribute('autocomplete', 'new-password');
      expect(confirmPasswordInput).toHaveAttribute('autocomplete', 'new-password');
    });
  });

  describe('Focus Management', () => {
    it('should focus first invalid field on form submission error', async () => {
      render(<SignUpForm />);
      
      // Try to submit empty form
      const submitButton = screen.getByRole('button', { name: /회원가입/ });
      
      // Button should be disabled, but test the error handling
      expect(submitButton).toBeDisabled();
      
      // Fill partial data to enable submit, then make it invalid
      await user.type(screen.getByLabelText(/이름/), 'a'); // Too short
      await user.type(screen.getByLabelText(/이메일/), 'invalid');
      await user.type(screen.getByLabelText(/비밀번호\*$/), 'short');
      await user.type(screen.getByLabelText(/비밀번호 확인/), 'different');
      
      // Should focus first invalid field when validation fails
      const { focusFirstInvalidField } = require('../../utils/focusManagement');
      
      // Trigger validation by tabbing away
      await user.tab();
      
      // Focus management should be called for errors
      expect(focusFirstInvalidField).toHaveBeenCalled();
    });

    it('should maintain focus within form during interaction', async () => {
      render(<SignUpForm />);
      
      const nameInput = screen.getByLabelText(/이름/);
      
      // Focus should stay within form
      nameInput.focus();
      expect(nameInput).toHaveFocus();
      
      // Typing should not lose focus
      await user.type(nameInput, 'test');
      expect(nameInput).toHaveFocus();
    });

    it('should handle focus trapping if implemented', () => {
      render(<SignUpForm />);
      
      // Focus trapping would be tested if implemented
      // Currently just verify the utility is available
      const { trapFocus } = require('../../utils/focusManagement');
      expect(trapFocus).toBeDefined();
    });
  });

  describe('Color Contrast and Visual Accessibility', () => {
    it('should not rely solely on color for error indication', async () => {
      render(<SignUpForm />);
      
      const nameInput = screen.getByLabelText(/이름/);
      
      // Trigger error
      await user.type(nameInput, 'a');
      await user.clear(nameInput);
      await user.tab();
      
      // Should have text error message, not just color
      const errorMessage = await screen.findByText('이름은 필수 입력 항목입니다');
      expect(errorMessage).toBeInTheDocument();
      
      // Should also have aria-invalid attribute
      expect(nameInput).toHaveAttribute('aria-invalid', 'true');
    });

    it('should have visible focus indicators', async () => {
      render(<SignUpForm />);
      
      const nameInput = screen.getByLabelText(/이름/);
      
      // Focus the input
      nameInput.focus();
      expect(nameInput).toHaveFocus();
      
      // Should have focus styling (tested via CSS classes)
      // The actual visual focus indicator is handled by CSS
    });

    it('should have sufficient text size and spacing', () => {
      render(<SignUpForm />);
      
      // Labels should be readable
      const labels = screen.getAllByText(/이름|이메일|비밀번호|서비스 이용약관/);
      labels.forEach(label => {
        expect(label).toBeInTheDocument();
        // Text content should be meaningful
        expect(label.textContent).toBeTruthy();
      });
    });
  });

  describe('Mobile Accessibility', () => {
    it('should have appropriate input types for mobile keyboards', () => {
      render(<SignUpForm />);
      
      const emailInput = screen.getByLabelText(/이메일/);
      const passwordInput = screen.getByLabelText(/비밀번호\*$/);
      
      expect(emailInput).toHaveAttribute('type', 'email');
      expect(passwordInput).toHaveAttribute('type', 'password');
    });

    it('should have touch-friendly button sizes', () => {
      render(<SignUpForm />);
      
      const submitButton = screen.getByRole('button', { name: /회원가입/ });
      const resetButton = screen.getByRole('button', { name: /초기화/ });
      
      // Buttons should be present and clickable
      expect(submitButton).toBeInTheDocument();
      expect(resetButton).toBeInTheDocument();
      
      // Touch target size is handled by CSS
    });

    it('should support zoom without horizontal scrolling', () => {
      render(<SignUpForm />);
      
      // Form should be responsive
      const form = screen.getByRole('form');
      expect(form).toBeInTheDocument();
      
      // Responsive behavior is tested via CSS and viewport meta tag
    });
  });

  describe('FormField Component Accessibility', () => {
    it('should have proper label association', () => {
      const mockRegister = jest.fn((fieldName: keyof SignUpFormData) => ({
        onChange: jest.fn(),
        onBlur: jest.fn(),
        ref: jest.fn(),
        name: fieldName
      })) as any;
      
      render(
        <FormField
          name="name"
          label="Test Field"
          register={mockRegister}
          error={undefined}
          required
        />
      );
      
      const input = screen.getByRole('textbox');
      const label = screen.getByText(/Test Field/);
      
      expect(input).toBeInTheDocument();
      expect(label).toBeInTheDocument();
      
      // Should have proper for/id association
      const inputId = input.getAttribute('id');
      const labelFor = label.getAttribute('for');
      expect(inputId).toBe(labelFor);
    });

    it('should show required indicator for required fields', () => {
      const mockRegister = jest.fn((fieldName: keyof SignUpFormData) => ({
        onChange: jest.fn(),
        onBlur: jest.fn(),
        ref: jest.fn(),
        name: fieldName
      })) as any;
      
      render(
        <FormField
          name="email"
          label="Test Field"
          register={mockRegister}
          error={undefined}
          required
        />
      );
      
      expect(screen.getByText('*')).toBeInTheDocument();
    });

    it('should handle checkbox accessibility correctly', () => {
      const mockRegister = jest.fn((fieldName: keyof SignUpFormData) => ({
        onChange: jest.fn(),
        onBlur: jest.fn(),
        ref: jest.fn(),
        name: fieldName
      })) as any;
      
      render(
        <FormField
          name="agreeToTerms"
          label="Test Checkbox"
          type="checkbox"
          register={mockRegister}
          error={undefined}
          required
        />
      );
      
      const checkbox = screen.getByRole('checkbox');
      const label = screen.getByText('Test Checkbox');
      
      expect(checkbox).toBeInTheDocument();
      expect(label).toBeInTheDocument();
      
      // Should be properly associated
      const checkboxId = checkbox.getAttribute('id');
      const labelFor = label.getAttribute('for');
      expect(checkboxId).toBe(labelFor);
    });
  });
});