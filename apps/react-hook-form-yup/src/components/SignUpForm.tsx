import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { signUpSchema } from '../schemas/signUpSchema';
import { SignUpFormData, SignUpFormProps } from '../types/signUp.types';
import FormField from './FormField';

/**
 * SignUpForm Component
 * Main signup form component with React Hook Form integration and Yup validation
 */
export const SignUpForm: React.FC<SignUpFormProps> = ({
  onSubmit,
  onReset,
  className = ''
}) => {
  // React Hook Form setup with Yup resolver
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid, isDirty, isSubmitting }
  } = useForm<SignUpFormData>({
    resolver: yupResolver(signUpSchema),
    mode: 'onChange', // Real-time validation
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      agreeToTerms: false
    }
  });

  // Form submission handler with error handling
  const onSubmitHandler = handleSubmit(
    async (data: SignUpFormData) => {
      try {
        // Log form data to console for debugging
        console.log('회원가입 데이터:', data);
        
        // Process form data (remove confirmPassword from submission data)
        const { confirmPassword, ...submissionData } = data;
        console.log('제출할 데이터:', submissionData);
        
        // Call external onSubmit handler if provided
        if (onSubmit) {
          await onSubmit(data);
        }
        
        // Show success message to user
        alert('회원가입이 완료되었습니다!');
        
        // Reset form after successful submission
        reset();
        
      } catch (error) {
        // Handle form submission errors gracefully
        console.error('회원가입 실패:', error);
        
        // Show user-friendly error message
        const errorMessage = error instanceof Error 
          ? error.message 
          : '회원가입 중 오류가 발생했습니다. 다시 시도해주세요.';
        
        alert(errorMessage);
      }
    },
    (errors) => {
      // Handle validation errors
      console.error('폼 유효성 검사 실패:', errors);
      
      // Find first error field and focus on it
      const firstErrorField = Object.keys(errors)[0];
      if (firstErrorField) {
        const element = document.querySelector(`[name="${firstErrorField}"]`) as HTMLElement;
        element?.focus();
      }
    }
  );

  // Form reset handler - clears all fields, errors, and resets form state
  const onResetHandler = () => {
    // Reset form to initial values and clear all errors
    reset({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      agreeToTerms: false
    });
    
    // Call external onReset handler if provided
    if (onReset) {
      onReset();
    }
    
    // Log reset action for debugging
    console.log('폼이 초기화되었습니다');
  };

  return (
    <div 
      className={`signup-form ${className}`}
      style={{
        maxWidth: '400px',
        margin: '0 auto',
        padding: '24px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
      }}
    >
      <h2 style={{ 
        textAlign: 'center', 
        marginBottom: '24px', 
        color: '#333',
        fontSize: '24px',
        fontWeight: '600'
      }}>
        회원가입
      </h2>
      <form onSubmit={onSubmitHandler} noValidate>
        {/* Name field with real-time validation */}
        <FormField
          name="name"
          label="이름"
          type="text"
          register={register}
          error={errors.name}
          placeholder="이름을 입력해주세요"
          required
        />

        {/* Email field with format validation */}
        <FormField
          name="email"
          label="이메일"
          type="email"
          register={register}
          error={errors.email}
          placeholder="이메일을 입력해주세요"
          required
        />

        {/* Password field with strength requirements */}
        <FormField
          name="password"
          label="비밀번호"
          type="password"
          register={register}
          error={errors.password}
          placeholder="비밀번호를 입력해주세요 (최소 8자, 특수문자 포함)"
          required
        />

        {/* Confirm password field with match validation */}
        <FormField
          name="confirmPassword"
          label="비밀번호 확인"
          type="password"
          register={register}
          error={errors.confirmPassword}
          placeholder="비밀번호를 다시 입력해주세요"
          required
        />

        {/* Terms agreement checkbox with required validation */}
        <FormField
          name="agreeToTerms"
          label="서비스 이용약관 및 개인정보 처리방침에 동의합니다"
          type="checkbox"
          register={register}
          error={errors.agreeToTerms}
          required
        />

        {/* Submit and Reset buttons */}
        <div 
          className="form-actions"
          style={{
            display: 'flex',
            gap: '12px',
            marginTop: '24px',
            justifyContent: 'center'
          }}
        >
          <button
            type="submit"
            disabled={!isValid || isSubmitting}
            className="submit-button"
            style={{
              padding: '12px 24px',
              backgroundColor: isValid && !isSubmitting ? '#007bff' : '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: isValid && !isSubmitting ? 'pointer' : 'not-allowed',
              fontSize: '16px',
              fontWeight: '500',
              transition: 'background-color 0.2s'
            }}
          >
            {isSubmitting ? '처리 중...' : '회원가입'}
          </button>
          
          <button
            type="button"
            onClick={onResetHandler}
            disabled={isSubmitting}
            className="reset-button"
            style={{
              padding: '12px 24px',
              backgroundColor: isSubmitting ? '#6c757d' : '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              fontSize: '16px',
              fontWeight: '500',
              transition: 'background-color 0.2s'
            }}
          >
            초기화
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignUpForm;