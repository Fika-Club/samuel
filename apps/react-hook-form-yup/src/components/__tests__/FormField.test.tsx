import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useForm } from 'react-hook-form';
import FormField from '../FormField';
import { SignUpFormData } from '../../types/signUp.types';

// Test wrapper component to provide React Hook Form context
const FormFieldWrapper: React.FC<{
  name: keyof SignUpFormData;
  label: string;
  type?: 'text' | 'email' | 'password' | 'checkbox';
  placeholder?: string;
  required?: boolean;
  initialError?: string;
}> = ({ name, label, type, placeholder, required, initialError }) => {
  const { register, formState: { errors }, setError } = useForm<SignUpFormData>({
    mode: 'onChange'
  });

  // Set initial error if provided
  React.useEffect(() => {
    if (initialError) {
      setError(name, { type: 'manual', message: initialError });
    }
  }, [initialError, name, setError]);

  return (
    <FormField
      name={name}
      label={label}
      type={type}
      register={register}
      error={errors[name]}
      placeholder={placeholder}
      required={required}
    />
  );
};

describe('FormField Component', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
  });

  describe('Text Input Fields', () => {
    it('should render text input with correct attributes', () => {
      render(
        <FormFieldWrapper
          name="name"
          label="이름"
          type="text"
          placeholder="이름을 입력하세요"
          required
        />
      );

      const input = screen.getByLabelText(/이름/);
      const label = screen.getByText('이름');

      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('type', 'text');
      expect(input).toHaveAttribute('placeholder', '이름을 입력하세요');
      expect(input).toHaveAttribute('id', 'field-name');
      expect(label).toHaveAttribute('for', 'field-name');
      expect(screen.getByText('*')).toBeInTheDocument(); // Required asterisk
    });

    it('should handle user input correctly', async () => {
      render(
        <FormFieldWrapper
          name="name"
          label="이름"
          type="text"
        />
      );

      const input = screen.getByLabelText(/이름/) as HTMLInputElement;
      
      await user.type(input, '홍길동');
      
      expect(input.value).toBe('홍길동');
    });

    it('should show focus state when focused', async () => {
      render(
        <FormFieldWrapper
          name="name"
          label="이름"
          type="text"
        />
      );

      const input = screen.getByLabelText(/이름/);
      const fieldContainer = input.closest('.form-field');

      await user.click(input);
      
      expect(fieldContainer).toHaveClass('is-focused');
    });

    it('should show valid state when has value and no error', async () => {
      render(
        <FormFieldWrapper
          name="name"
          label="이름"
          type="text"
        />
      );

      const input = screen.getByLabelText(/이름/);
      const fieldContainer = input.closest('.form-field');

      await user.type(input, '홍길동');
      
      expect(fieldContainer).toHaveClass('is-valid');
    });

    it('should show error state when has error', () => {
      render(
        <FormFieldWrapper
          name="name"
          label="이름"
          type="text"
          initialError="이름은 필수 입력 항목입니다"
        />
      );

      const input = screen.getByLabelText(/이름/);
      const fieldContainer = input.closest('.form-field');
      const errorMessage = screen.getByText('이름은 필수 입력 항목입니다');

      expect(fieldContainer).toHaveClass('has-error');
      expect(input).toHaveAttribute('aria-invalid', 'true');
      expect(input).toHaveAttribute('aria-describedby', 'error-name');
      expect(errorMessage).toBeInTheDocument();
    });
  });

  describe('Email Input Fields', () => {
    it('should render email input with correct attributes', () => {
      render(
        <FormFieldWrapper
          name="email"
          label="이메일"
          type="email"
          placeholder="이메일을 입력하세요"
        />
      );

      const input = screen.getByLabelText(/이메일/);

      expect(input).toHaveAttribute('type', 'email');
      expect(input).toHaveAttribute('autocomplete', 'email');
      expect(input).toHaveAttribute('placeholder', '이메일을 입력하세요');
    });

    it('should handle email input correctly', async () => {
      render(
        <FormFieldWrapper
          name="email"
          label="이메일"
          type="email"
        />
      );

      const input = screen.getByLabelText(/이메일/) as HTMLInputElement;
      
      await user.type(input, 'test@example.com');
      
      expect(input.value).toBe('test@example.com');
    });
  });

  describe('Password Input Fields', () => {
    it('should render password input with correct attributes', () => {
      render(
        <FormFieldWrapper
          name="password"
          label="비밀번호"
          type="password"
          placeholder="비밀번호를 입력하세요"
        />
      );

      const input = screen.getByLabelText(/비밀번호/);

      expect(input).toHaveAttribute('type', 'password');
      expect(input).toHaveAttribute('autocomplete', 'new-password');
      expect(input).toHaveAttribute('placeholder', '비밀번호를 입력하세요');
    });

    it('should handle password input correctly', async () => {
      render(
        <FormFieldWrapper
          name="password"
          label="비밀번호"
          type="password"
        />
      );

      const input = screen.getByLabelText(/비밀번호/) as HTMLInputElement;
      
      await user.type(input, 'password123!');
      
      expect(input.value).toBe('password123!');
    });

    it('should set correct autocomplete for confirm password', () => {
      render(
        <FormFieldWrapper
          name="confirmPassword"
          label="비밀번호 확인"
          type="password"
        />
      );

      const input = screen.getByLabelText(/비밀번호 확인/);

      expect(input).toHaveAttribute('autocomplete', 'new-password');
    });
  });

  describe('Checkbox Input Fields', () => {
    it('should render checkbox with correct attributes', () => {
      render(
        <FormFieldWrapper
          name="agreeToTerms"
          label="서비스 이용약관에 동의합니다"
          type="checkbox"
          required
        />
      );

      const checkbox = screen.getByLabelText(/서비스 이용약관에 동의합니다/);
      const label = screen.getByText('서비스 이용약관에 동의합니다');

      expect(checkbox).toHaveAttribute('type', 'checkbox');
      expect(checkbox).toHaveAttribute('id', 'field-agreeToTerms');
      expect(label).toHaveAttribute('for', 'field-agreeToTerms');
      expect(screen.getByText('*')).toBeInTheDocument(); // Required asterisk
    });

    it('should handle checkbox state changes', async () => {
      render(
        <FormFieldWrapper
          name="agreeToTerms"
          label="서비스 이용약관에 동의합니다"
          type="checkbox"
        />
      );

      const checkbox = screen.getByLabelText(/서비스 이용약관에 동의합니다/) as HTMLInputElement;

      expect(checkbox.checked).toBe(false);

      await user.click(checkbox);
      expect(checkbox.checked).toBe(true);

      await user.click(checkbox);
      expect(checkbox.checked).toBe(false);
    });

    it('should show error state for checkbox', () => {
      render(
        <FormFieldWrapper
          name="agreeToTerms"
          label="서비스 이용약관에 동의합니다"
          type="checkbox"
          initialError="약관에 동의해주세요"
        />
      );

      const checkbox = screen.getByLabelText(/서비스 이용약관에 동의합니다/);
      const checkboxContainer = checkbox.closest('.checkbox-container');
      const errorMessage = screen.getByText('약관에 동의해주세요');

      expect(checkboxContainer).toHaveClass('has-error');
      expect(checkbox).toHaveAttribute('aria-invalid', 'true');
      expect(checkbox).toHaveAttribute('aria-describedby', 'error-agreeToTerms');
      expect(errorMessage).toBeInTheDocument();
    });
  });

  describe('Field States and Classes', () => {
    it('should apply custom className', () => {
      render(
        <FormFieldWrapper
          name="name"
          label="이름"
          type="text"
        />
      );

      const fieldContainer = screen.getByLabelText(/이름/).closest('.form-field');
      expect(fieldContainer).toHaveClass('form-field');
    });

    it('should combine multiple state classes', async () => {
      render(
        <FormFieldWrapper
          name="name"
          label="이름"
          type="text"
          initialError="이름은 필수 입력 항목입니다"
        />
      );

      const input = screen.getByLabelText(/이름/);
      const fieldContainer = input.closest('.form-field');

      // Initially has error
      expect(fieldContainer).toHaveClass('has-error');

      // Focus should add focused class
      await user.click(input);
      expect(fieldContainer).toHaveClass('has-error', 'is-focused');
    });

    it('should handle focus and blur events', async () => {
      render(
        <FormFieldWrapper
          name="name"
          label="이름"
          type="text"
        />
      );

      const input = screen.getByLabelText(/이름/);
      const fieldContainer = input.closest('.form-field');

      // Focus
      await user.click(input);
      expect(fieldContainer).toHaveClass('is-focused');

      // Blur
      await user.tab();
      expect(fieldContainer).not.toHaveClass('is-focused');
    });
  });

  describe('Accessibility Features', () => {
    it('should have proper ARIA attributes', () => {
      render(
        <FormFieldWrapper
          name="name"
          label="이름"
          type="text"
          required
        />
      );

      const input = screen.getByLabelText(/이름/);
      const label = screen.getByText('이름');

      expect(input).toHaveAttribute('aria-invalid', 'false');
      expect(label).toHaveAttribute('for', 'field-name');
      expect(input).toHaveAttribute('id', 'field-name');
    });

    it('should update ARIA attributes when error occurs', () => {
      render(
        <FormFieldWrapper
          name="name"
          label="이름"
          type="text"
          initialError="이름은 필수 입력 항목입니다"
        />
      );

      const input = screen.getByLabelText(/이름/);

      expect(input).toHaveAttribute('aria-invalid', 'true');
      expect(input).toHaveAttribute('aria-describedby', 'error-name');
    });

    it('should have proper autocomplete attributes', () => {
      const testCases = [
        { name: 'name' as const, expected: 'name' },
        { name: 'email' as const, expected: 'email' },
        { name: 'password' as const, expected: 'new-password' },
        { name: 'confirmPassword' as const, expected: 'new-password' }
      ];

      testCases.forEach(({ name, expected }) => {
        const { unmount } = render(
          <FormFieldWrapper
            name={name}
            label={name}
            type={name === 'email' ? 'email' : name.includes('password') ? 'password' : 'text'}
          />
        );

        const input = screen.getByLabelText(name);
        expect(input).toHaveAttribute('autocomplete', expected);

        unmount();
      });
    });
  });

  describe('Error Message Integration', () => {
    it('should show error message when error exists', () => {
      render(
        <FormFieldWrapper
          name="name"
          label="이름"
          type="text"
          initialError="이름은 필수 입력 항목입니다"
        />
      );

      const errorMessage = screen.getByText('이름은 필수 입력 항목입니다');
      expect(errorMessage).toBeInTheDocument();
      expect(errorMessage).toHaveAttribute('role', 'alert');
      expect(errorMessage).toHaveAttribute('aria-live', 'polite');
    });

    it('should hide error message when no error', () => {
      render(
        <FormFieldWrapper
          name="name"
          label="이름"
          type="text"
        />
      );

      const errorMessage = screen.queryByRole('alert');
      expect(errorMessage).not.toBeInTheDocument();
    });
  });
});