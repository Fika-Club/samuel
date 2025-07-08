import { UseFormRegister, FieldError } from 'react-hook-form';

/**
 * SignUp Form Data Interface
 * Defines the structure of the signup form data
 */
export interface SignUpFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

/**
 * SignUp Form Props Interface
 * Props for the main SignUpForm component
 */
export interface SignUpFormProps {
  onSubmit?: (data: SignUpFormData) => void | Promise<void>;
  onReset?: () => void;
  className?: string;
}

/**
 * Form Field Props Interface
 * Props for reusable form field components with React Hook Form integration
 */
export interface FormFieldProps {
  name: keyof SignUpFormData;
  label: string;
  type?: 'text' | 'email' | 'password' | 'checkbox';
  register: UseFormRegister<SignUpFormData>;
  error?: FieldError;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

/**
 * Error Message Props Interface
 * Props for error message display component
 */
export interface ErrorMessageProps {
  message?: string;
  visible: boolean;
  className?: string;
}

/**
 * Form Validation State Interface
 * Represents the current validation state of the form
 */
export interface FormValidationState {
  isValid: boolean;
  isDirty: boolean;
  isSubmitting: boolean;
  errors: Partial<Record<keyof SignUpFormData, FieldError>>;
}

/**
 * Form Submit Handler Type
 * Type definition for form submission handler
 */
export type FormSubmitHandler = (data: SignUpFormData) => void | Promise<void>;

/**
 * Form Reset Handler Type
 * Type definition for form reset handler
 */
export type FormResetHandler = () => void;