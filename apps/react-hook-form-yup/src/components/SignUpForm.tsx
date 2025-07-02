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

  // Form submission handler
  const onSubmitHandler = handleSubmit((data: SignUpFormData) => {
    if (onSubmit) {
      onSubmit(data);
    }
  });

  // Form reset handler
  const onResetHandler = () => {
    reset();
    if (onReset) {
      onReset();
    }
  };

  return (
    <div className={`signup-form ${className}`}>
      <h2>회원가입</h2>
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
        <div className="form-actions">
          <button
            type="submit"
            disabled={!isValid || isSubmitting}
            className="submit-button"
          >
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
      </form>
    </div>
  );
};

export default SignUpForm;