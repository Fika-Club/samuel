import { signUpSchema } from '../signUpSchema';
import * as yup from 'yup';

describe('signUpSchema', () => {
  describe('name validation', () => {
    it('should pass with valid name (2+ characters)', async () => {
      const validData = {
        name: '홍길동',
        email: 'test@example.com',
        password: 'password123!',
        confirmPassword: 'password123!',
        agreeToTerms: true
      };

      await expect(signUpSchema.validate(validData)).resolves.toEqual(validData);
    });

    it('should fail when name is empty', async () => {
      const invalidData = {
        name: '',
        email: 'test@example.com',
        password: 'password123!',
        confirmPassword: 'password123!',
        agreeToTerms: true
      };

      await expect(signUpSchema.validate(invalidData)).rejects.toThrow('이름은 필수 입력 항목입니다');
    });

    it('should fail when name is undefined', async () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'password123!',
        confirmPassword: 'password123!',
        agreeToTerms: true
      };

      await expect(signUpSchema.validate(invalidData)).rejects.toThrow('이름은 필수 입력 항목입니다');
    });

    it('should fail when name is less than 2 characters', async () => {
      const invalidData = {
        name: '김',
        email: 'test@example.com',
        password: 'password123!',
        confirmPassword: 'password123!',
        agreeToTerms: true
      };

      await expect(signUpSchema.validate(invalidData)).rejects.toThrow('이름은 최소 2자 이상이어야 합니다');
    });

    it('should pass with exactly 2 characters', async () => {
      const validData = {
        name: '김철',
        email: 'test@example.com',
        password: 'password123!',
        confirmPassword: 'password123!',
        agreeToTerms: true
      };

      await expect(signUpSchema.validate(validData)).resolves.toEqual(validData);
    });

    it('should pass with long names', async () => {
      const validData = {
        name: '김철수김철수김철수',
        email: 'test@example.com',
        password: 'password123!',
        confirmPassword: 'password123!',
        agreeToTerms: true
      };

      await expect(signUpSchema.validate(validData)).resolves.toEqual(validData);
    });
  });

  describe('email validation', () => {
    it('should pass with valid email format', async () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.kr',
        'test123@gmail.com',
        'user+tag@example.org'
      ];

      for (const email of validEmails) {
        const validData = {
          name: '홍길동',
          email,
          password: 'password123!',
          confirmPassword: 'password123!',
          agreeToTerms: true
        };

        await expect(signUpSchema.validate(validData)).resolves.toEqual(validData);
      }
    });

    it('should fail when email is empty', async () => {
      const invalidData = {
        name: '홍길동',
        email: '',
        password: 'password123!',
        confirmPassword: 'password123!',
        agreeToTerms: true
      };

      await expect(signUpSchema.validate(invalidData)).rejects.toThrow('이메일은 필수 입력 항목입니다');
    });

    it('should fail when email is undefined', async () => {
      const invalidData = {
        name: '홍길동',
        password: 'password123!',
        confirmPassword: 'password123!',
        agreeToTerms: true
      };

      await expect(signUpSchema.validate(invalidData)).rejects.toThrow('이메일은 필수 입력 항목입니다');
    });

    it('should fail with invalid email formats', async () => {
      const invalidEmails = [
        'invalid-email',
        '@example.com',
        'test@',
        'test.example.com',
        'test@.com',
        'test@example.'
      ];

      for (const email of invalidEmails) {
        const invalidData = {
          name: '홍길동',
          email,
          password: 'password123!',
          confirmPassword: 'password123!',
          agreeToTerms: true
        };

        await expect(signUpSchema.validate(invalidData)).rejects.toThrow('올바른 이메일 형식을 입력해주세요');
      }
    });
  });

  describe('password validation', () => {
    it('should pass with valid password (8+ chars with special character)', async () => {
      const validPasswords = [
        'password123!',
        'mySecure@Pass',
        'test1234#',
        'P@ssw0rd',
        'longPassword123!'
      ];

      for (const password of validPasswords) {
        const validData = {
          name: '홍길동',
          email: 'test@example.com',
          password,
          confirmPassword: password,
          agreeToTerms: true
        };

        await expect(signUpSchema.validate(validData)).resolves.toEqual(validData);
      }
    });

    it('should fail when password is empty', async () => {
      await expect(signUpSchema.validateAt('password', { password: '' })).rejects.toThrow('비밀번호는 필수 입력 항목입니다');
    });

    it('should fail when password is undefined', async () => {
      await expect(signUpSchema.validateAt('password', {})).rejects.toThrow('비밀번호는 필수 입력 항목입니다');
    });

    it('should fail when password is less than 8 characters', async () => {
      const shortPasswords = [
        'pass!',
        '1234567',
        'short@',
        'abc123!'
      ];

      for (const password of shortPasswords) {
        const invalidData = {
          name: '홍길동',
          email: 'test@example.com',
          password,
          confirmPassword: password,
          agreeToTerms: true
        };

        await expect(signUpSchema.validate(invalidData)).rejects.toThrow('비밀번호는 최소 8자 이상이어야 합니다');
      }
    });

    it('should fail when password lacks special characters', async () => {
      const noSpecialCharPasswords = [
        'password123',
        'mySecurePass',
        'test1234',
        'Password',
        'longPasswordWithoutSpecial123'
      ];

      for (const password of noSpecialCharPasswords) {
        const invalidData = {
          name: '홍길동',
          email: 'test@example.com',
          password,
          confirmPassword: password,
          agreeToTerms: true
        };

        await expect(signUpSchema.validate(invalidData)).rejects.toThrow('비밀번호에는 특수문자가 포함되어야 합니다');
      }
    });

    it('should pass with exactly 8 characters including special character', async () => {
      const validData = {
        name: '홍길동',
        email: 'test@example.com',
        password: 'pass123!',
        confirmPassword: 'pass123!',
        agreeToTerms: true
      };

      await expect(signUpSchema.validate(validData)).resolves.toEqual(validData);
    });

    it('should validate all special characters', async () => {
      const specialChars = '!@#$%^&*(),.?":{}|<>';
      
      for (const char of specialChars) {
        const password = `password${char}`;
        const validData = {
          name: '홍길동',
          email: 'test@example.com',
          password,
          confirmPassword: password,
          agreeToTerms: true
        };

        await expect(signUpSchema.validate(validData)).resolves.toEqual(validData);
      }
    });
  });

  describe('confirmPassword validation', () => {
    it('should pass when confirmPassword matches password', async () => {
      const validData = {
        name: '홍길동',
        email: 'test@example.com',
        password: 'password123!',
        confirmPassword: 'password123!',
        agreeToTerms: true
      };

      await expect(signUpSchema.validate(validData)).resolves.toEqual(validData);
    });

    it('should fail when confirmPassword is empty', async () => {
      const testData = {
        password: 'password123!',
        confirmPassword: ''
      };
      // Yup validates oneOf before required, so empty string fails with mismatch error
      await expect(signUpSchema.validateAt('confirmPassword', testData)).rejects.toThrow('비밀번호가 일치하지 않습니다');
    });

    it('should fail when confirmPassword is undefined', async () => {
      const invalidData = {
        name: '홍길동',
        email: 'test@example.com',
        password: 'password123!',
        agreeToTerms: true
      };

      await expect(signUpSchema.validate(invalidData)).rejects.toThrow('비밀번호 확인은 필수 입력 항목입니다');
    });

    it('should fail when confirmPassword does not match password', async () => {
      const mismatchCases = [
        { password: 'password123!', confirmPassword: 'password124!' },
        { password: 'password123!', confirmPassword: 'Password123!' },
        { password: 'password123!', confirmPassword: 'password123' },
        { password: 'password123!', confirmPassword: 'different123!' }
      ];

      for (const { password, confirmPassword } of mismatchCases) {
        const invalidData = {
          name: '홍길동',
          email: 'test@example.com',
          password,
          confirmPassword,
          agreeToTerms: true
        };

        await expect(signUpSchema.validate(invalidData)).rejects.toThrow('비밀번호가 일치하지 않습니다');
      }
    });

    it('should be case sensitive', async () => {
      const invalidData = {
        name: '홍길동',
        email: 'test@example.com',
        password: 'Password123!',
        confirmPassword: 'password123!',
        agreeToTerms: true
      };

      await expect(signUpSchema.validate(invalidData)).rejects.toThrow('비밀번호가 일치하지 않습니다');
    });
  });

  describe('agreeToTerms validation', () => {
    it('should pass when agreeToTerms is true', async () => {
      const validData = {
        name: '홍길동',
        email: 'test@example.com',
        password: 'password123!',
        confirmPassword: 'password123!',
        agreeToTerms: true
      };

      await expect(signUpSchema.validate(validData)).resolves.toEqual(validData);
    });

    it('should fail when agreeToTerms is false', async () => {
      const invalidData = {
        name: '홍길동',
        email: 'test@example.com',
        password: 'password123!',
        confirmPassword: 'password123!',
        agreeToTerms: false
      };

      await expect(signUpSchema.validate(invalidData)).rejects.toThrow('약관에 동의해주세요');
    });

    it('should fail when agreeToTerms is undefined', async () => {
      const invalidData = {
        name: '홍길동',
        email: 'test@example.com',
        password: 'password123!',
        confirmPassword: 'password123!'
      };

      await expect(signUpSchema.validate(invalidData)).rejects.toThrow('약관에 동의해주세요');
    });
  });

  describe('complete form validation', () => {
    it('should pass with all valid data', async () => {
      const validData = {
        name: '홍길동',
        email: 'hong@example.com',
        password: 'securePass123!',
        confirmPassword: 'securePass123!',
        agreeToTerms: true
      };

      await expect(signUpSchema.validate(validData)).resolves.toEqual(validData);
    });

    it('should fail with multiple validation errors', async () => {
      const invalidData = {
        name: '',
        email: 'invalid-email',
        password: 'short',
        confirmPassword: 'different',
        agreeToTerms: false
      };

      try {
        await signUpSchema.validate(invalidData, { abortEarly: false });
      } catch (error) {
        expect(error).toBeInstanceOf(yup.ValidationError);
        const validationError = error as yup.ValidationError;
        expect(validationError.errors).toContain('이름은 필수 입력 항목입니다');
        expect(validationError.errors).toContain('올바른 이메일 형식을 입력해주세요');
        expect(validationError.errors).toContain('비밀번호는 최소 8자 이상이어야 합니다');
        expect(validationError.errors).toContain('약관에 동의해주세요');
      }
    });

    it('should validate field by field', async () => {
      // Test individual field validation
      await expect(signUpSchema.validateAt('name', { name: '홍길동' })).resolves.toBe('홍길동');
      await expect(signUpSchema.validateAt('email', { email: 'test@example.com' })).resolves.toBe('test@example.com');
      await expect(signUpSchema.validateAt('password', { password: 'password123!' })).resolves.toBe('password123!');
      await expect(signUpSchema.validateAt('agreeToTerms', { agreeToTerms: true })).resolves.toBe(true);
    });

    it('should handle edge cases with whitespace', async () => {
      const dataWithWhitespace = {
        name: '  홍길동  ',
        email: 'test@example.com',
        password: 'password123!',
        confirmPassword: 'password123!',
        agreeToTerms: true
      };

      // Yup doesn't automatically trim whitespace unless .trim() is called
      // So the validation should pass but preserve the whitespace
      await expect(signUpSchema.validate(dataWithWhitespace)).resolves.toEqual(dataWithWhitespace);
    });
  });
});