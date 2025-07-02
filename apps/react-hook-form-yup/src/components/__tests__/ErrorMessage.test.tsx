import React from 'react';
import { render, screen } from '@testing-library/react';
import ErrorMessage from '../ErrorMessage';

describe('ErrorMessage Component', () => {
  describe('Rendering Behavior', () => {
    it('should render error message when visible is true and message exists', () => {
      render(
        <ErrorMessage
          message="이름은 필수 입력 항목입니다"
          visible={true}
        />
      );

      const errorMessage = screen.getByText('이름은 필수 입력 항목입니다');
      expect(errorMessage).toBeInTheDocument();
    });

    it('should not render when visible is false', () => {
      render(
        <ErrorMessage
          message="이름은 필수 입력 항목입니다"
          visible={false}
        />
      );

      const errorMessage = screen.queryByText('이름은 필수 입력 항목입니다');
      expect(errorMessage).not.toBeInTheDocument();
    });

    it('should not render when message is undefined', () => {
      render(
        <ErrorMessage
          message={undefined}
          visible={true}
        />
      );

      const errorMessage = screen.queryByRole('alert');
      expect(errorMessage).not.toBeInTheDocument();
    });

    it('should not render when message is empty string', () => {
      render(
        <ErrorMessage
          message=""
          visible={true}
        />
      );

      const errorMessage = screen.queryByRole('alert');
      expect(errorMessage).not.toBeInTheDocument();
    });

    it('should not render when both visible is false and message is undefined', () => {
      render(
        <ErrorMessage
          message={undefined}
          visible={false}
        />
      );

      const errorMessage = screen.queryByRole('alert');
      expect(errorMessage).not.toBeInTheDocument();
    });
  });

  describe('Accessibility Features', () => {
    it('should have proper ARIA attributes', () => {
      render(
        <ErrorMessage
          message="이름은 필수 입력 항목입니다"
          visible={true}
        />
      );

      const errorMessage = screen.getByText('이름은 필수 입력 항목입니다');
      
      expect(errorMessage).toHaveAttribute('role', 'alert');
      expect(errorMessage).toHaveAttribute('aria-live', 'polite');
    });

    it('should have correct CSS class', () => {
      render(
        <ErrorMessage
          message="이름은 필수 입력 항목입니다"
          visible={true}
        />
      );

      const errorMessage = screen.getByText('이름은 필수 입력 항목입니다');
      expect(errorMessage).toHaveClass('error-message');
    });

    it('should be announced to screen readers', () => {
      render(
        <ErrorMessage
          message="이름은 필수 입력 항목입니다"
          visible={true}
        />
      );

      const errorMessage = screen.getByText('이름은 필수 입력 항목입니다');
      
      // aria-live="polite" ensures screen readers announce the message
      expect(errorMessage).toHaveAttribute('aria-live', 'polite');
      // role="alert" makes it an important announcement
      expect(errorMessage).toHaveAttribute('role', 'alert');
    });
  });

  describe('Message Content', () => {
    it('should display different error messages correctly', () => {
      const errorMessages = [
        '이름은 필수 입력 항목입니다',
        '이름은 최소 2자 이상이어야 합니다',
        '올바른 이메일 형식을 입력해주세요',
        '비밀번호는 최소 8자 이상이어야 합니다',
        '비밀번호에는 특수문자가 포함되어야 합니다',
        '비밀번호가 일치하지 않습니다',
        '약관에 동의해주세요'
      ];

      errorMessages.forEach((message) => {
        const { unmount } = render(
          <ErrorMessage
            message={message}
            visible={true}
          />
        );

        expect(screen.getByText(message)).toBeInTheDocument();
        unmount();
      });
    });

    it('should handle long error messages', () => {
      const longMessage = '이것은 매우 긴 에러 메시지입니다. 사용자가 입력한 데이터가 여러 조건을 만족하지 않을 때 표시되는 상세한 안내 메시지입니다.';
      
      render(
        <ErrorMessage
          message={longMessage}
          visible={true}
        />
      );

      expect(screen.getByText(longMessage)).toBeInTheDocument();
    });

    it('should handle special characters in messages', () => {
      const messageWithSpecialChars = '비밀번호에는 특수문자(!@#$%^&*)가 포함되어야 합니다';
      
      render(
        <ErrorMessage
          message={messageWithSpecialChars}
          visible={true}
        />
      );

      expect(screen.getByText(messageWithSpecialChars)).toBeInTheDocument();
    });

    it('should handle HTML entities correctly', () => {
      const messageWithEntities = '이메일 형식이 올바르지 않습니다 (예: user@domain.com)';
      
      render(
        <ErrorMessage
          message={messageWithEntities}
          visible={true}
        />
      );

      expect(screen.getByText(messageWithEntities)).toBeInTheDocument();
    });
  });

  describe('Component State Changes', () => {
    it('should show and hide message based on visible prop changes', () => {
      const { rerender } = render(
        <ErrorMessage
          message="이름은 필수 입력 항목입니다"
          visible={false}
        />
      );

      // Initially hidden
      expect(screen.queryByText('이름은 필수 입력 항목입니다')).not.toBeInTheDocument();

      // Show message
      rerender(
        <ErrorMessage
          message="이름은 필수 입력 항목입니다"
          visible={true}
        />
      );

      expect(screen.getByText('이름은 필수 입력 항목입니다')).toBeInTheDocument();

      // Hide message again
      rerender(
        <ErrorMessage
          message="이름은 필수 입력 항목입니다"
          visible={false}
        />
      );

      expect(screen.queryByText('이름은 필수 입력 항목입니다')).not.toBeInTheDocument();
    });

    it('should update message content when message prop changes', () => {
      const { rerender } = render(
        <ErrorMessage
          message="이름은 필수 입력 항목입니다"
          visible={true}
        />
      );

      expect(screen.getByText('이름은 필수 입력 항목입니다')).toBeInTheDocument();

      // Change message
      rerender(
        <ErrorMessage
          message="이름은 최소 2자 이상이어야 합니다"
          visible={true}
        />
      );

      expect(screen.queryByText('이름은 필수 입력 항목입니다')).not.toBeInTheDocument();
      expect(screen.getByText('이름은 최소 2자 이상이어야 합니다')).toBeInTheDocument();
    });

    it('should handle message becoming undefined', () => {
      const { rerender } = render(
        <ErrorMessage
          message="이름은 필수 입력 항목입니다"
          visible={true}
        />
      );

      expect(screen.getByText('이름은 필수 입력 항목입니다')).toBeInTheDocument();

      // Message becomes undefined
      rerender(
        <ErrorMessage
          message={undefined}
          visible={true}
        />
      );

      expect(screen.queryByText('이름은 필수 입력 항목입니다')).not.toBeInTheDocument();
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle whitespace-only messages', () => {
      render(
        <ErrorMessage
          message="   "
          visible={true}
        />
      );

      // Whitespace-only message should still render
      const errorMessage = screen.getByRole('alert');
      expect(errorMessage).toBeInTheDocument();
      expect(errorMessage.textContent).toBe('   ');
    });

    it('should handle zero-length string', () => {
      render(
        <ErrorMessage
          message=""
          visible={true}
        />
      );

      // Empty string should not render
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    it('should handle null message', () => {
      render(
        <ErrorMessage
          message={null as any}
          visible={true}
        />
      );

      // Null message should not render
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });
});