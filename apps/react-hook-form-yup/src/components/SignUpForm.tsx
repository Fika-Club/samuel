import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { signUpSchema } from '../schemas/signUpSchema';
import { SignUpFormData, SignUpFormProps } from '../types/signUp.types';

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
  const onSubmitHandler = (data: SignUpFormData) => {
    if (onSubmit) {
      onSubmit(data);
    }
  };

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
      <form onSubmit={handleSubmit(onSubmitHandler)} noValidate>
        {/* Form fields will be implemented in task 4.2 */}
        <div className="form-placeholder">
          <p>Form fields will be implemented in the next task</p>
          <p>Form state:</p>
          <ul>
            <li>Valid: {isValid ? 'Yes' : 'No'}</li>
            <li>Dirty: {isDirty ? 'Yes' : 'No'}</li>
            <li>Submitting: {isSubmitting ? 'Yes' : 'No'}</li>
            <li>Errors: {Object.keys(errors).length}</li>
          </ul>
        </div>

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