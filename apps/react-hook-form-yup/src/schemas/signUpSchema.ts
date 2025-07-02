import * as yup from 'yup';

/**
 * Yup validation schema for signup form
 * Implements comprehensive validation rules for all form fields
 */
export const signUpSchema = yup.object({
  // Name validation: required, minimum 2 characters
  name: yup
    .string()
    .required('이름은 필수 입력 항목입니다')
    .min(2, '이름은 최소 2자 이상이어야 합니다'),
  
  // Email validation: required, valid email format
  email: yup
    .string()
    .required('이메일은 필수 입력 항목입니다')
    .email('올바른 이메일 형식을 입력해주세요'),
  
  // Password validation: required, minimum 8 characters, must contain special character
  password: yup
    .string()
    .required('비밀번호는 필수 입력 항목입니다')
    .min(8, '비밀번호는 최소 8자 이상이어야 합니다')
    .matches(/[!@#$%^&*(),.?":{}|<>]/, '비밀번호에는 특수문자가 포함되어야 합니다'),
  
  // Confirm password validation: required, must match password
  confirmPassword: yup
    .string()
    .required('비밀번호 확인은 필수 입력 항목입니다')
    .oneOf([yup.ref('password')], '비밀번호가 일치하지 않습니다'),
  
  // Terms agreement validation: required to be true
  agreeToTerms: yup
    .boolean()
    .oneOf([true], '약관에 동의해주세요')
});

export type SignUpSchemaType = yup.InferType<typeof signUpSchema>;