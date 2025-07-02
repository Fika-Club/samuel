import React, { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { signUpSchema } from '../schemas/signUpSchema';
import { SignUpFormData, SignUpFormProps } from '../types/signUp.types';
import FormField from './FormField';
import { focusFirstInvalidField, handleFormKeyNavigation, announceToScreenReader } from '../utils/focusManagement';
import '../styles/SignUpForm.css';

/**
 * SignUpForm Component
 * Main signup form component with React Hook Form integration and Yup validation
 */
export const SignUpForm: React.FC<SignUpFormProps> = ({
  onSubmit,
  onReset,
  className = ''
}) => {
  const formRef = useRef<HTMLFormElement>(null);
  
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

  // Set up keyboard navigation
  useEffect(() => {
    const form = formRef.current;
    if (form) {
      form.addEventListener('keydown', handleFormKeyNavigation);
      return () => {
        form.removeEventListener('keydown', handleFormKeyNavigation);
      };
    }
  }, []);

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
        
        // Announce success to screen readers
        announceToScreenReader('회원가입이 성공적으로 완료되었습니다.');
        
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
      
      // Focus first invalid field and announce error
      focusFirstInvalidField(errors);
      announceToScreenReader('폼에 오류가 있습니다. 입력 내용을 확인해주세요.');
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
    
    // Announce reset to screen readers
    announceToScreenReader('폼이 초기화되었습니다.');
    
    // Log reset action for debugging
    console.log('폼이 초기화되었습니다');
  };

  // Calculate form completion progress
  const totalFields = 5;
  const completedFields = Object.keys(errors).length === 0 && isDirty ? 
    Object.values({ name: true, email: true, password: true, confirmPassword: true, agreeToTerms: true }).length : 
    0;
  const progressPercentage = (completedFields / totalFields) * 100;

  return (
    <div className={`signup-form ${className} ${isSubmitting ? 'is-submitting' : ''}`}>
      {/* Progress indicator */}
      <div 
        className="form-progress" 
        style={{ width: `${progressPercentage}%` }}
        aria-hidden="true"
      />
      
      <h2>회원가입</h2>
      <form 
        ref={formRef}
        onSubmit={onSubmitHandler} 
        noValidate
        role="form"
        aria-label="회원가입 폼"
        aria-describedby="form-description"
      >
        <div id="form-description" className="sr-only">
          회원가입을 위해 모든 필드를 입력해주세요. 필수 항목은 별표로 표시되어 있습니다.
        </div>
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
        <div className="form-actions">
          <button
            type="submit"
            disabled={!isValid || isSubmitting}
            className="submit-button"
            aria-describedby={!isValid ? "submit-help" : undefined}
          >
            {isSubmitting && <span className="loading-spinner" aria-hidden="true" />}
            {isSubmitting ? '처리 중...' : '회원가입'}
          </button>
          
          <button
            type="button"
            onClick={onResetHandler}
            disabled={isSubmitting}
            className="reset-button"
          >
            초기화
          </button>
        </div>
        
        {/* Submit button help text */}
        {!isValid && (
          <div 
            id="submit-help" 
            className="submit-help"
            style={{
              textAlign: 'center',
              marginTop: '8px',
              fontSize: '13px',
              color: '#6c757d'
            }}
          >
            모든 필드를 올바르게 입력해주세요
          </div>
        )}
      </form>
    </div>
  );
};

export default SignUpForm;