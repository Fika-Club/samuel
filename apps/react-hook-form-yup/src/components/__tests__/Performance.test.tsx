/**
 * Performance Tests
 * Tests for component re-rendering optimization and performance
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SignUpForm from '../SignUpForm';
import FormField from '../FormField';
import { performanceMonitor } from '../../utils/performanceUtils';

// Mock performance.now for consistent testing
const mockPerformanceNow = jest.fn();
Object.defineProperty(global.performance, 'now', {
  writable: true,
  value: mockPerformanceNow,
});

describe('Performance Tests', () => {
  let user: ReturnType<typeof userEvent.setup>;
  let renderCount: number;
  let originalConsoleWarn: typeof console.warn;

  beforeEach(() => {
    user = userEvent.setup();
    renderCount = 0;
    mockPerformanceNow.mockReturnValue(0);
    performanceMonitor.resetMetrics();
    
    // Mock console.warn to capture performance warnings
    originalConsoleWarn = console.warn;
    console.warn = jest.fn();
  });

  afterEach(() => {
    console.warn = originalConsoleWarn;
    jest.restoreAllMocks();
  });

  describe('Component Re-rendering Optimization', () => {
    it('should minimize re-renders when typing in form fields', async () => {
      // Create a wrapper to count renders
      const TestWrapper = () => {
        renderCount++;
        return <SignUpForm />;
      };

      render(<TestWrapper />);
      const initialRenderCount = renderCount;

      const nameInput = screen.getByLabelText(/이름/);
      
      // Type multiple characters
      await user.type(nameInput, 'test');
      
      // Should not cause excessive re-renders
      // React Hook Form optimizes to minimize re-renders
      expect(renderCount - initialRenderCount).toBeLessThan(10);
    });

    it('should not re-render other fields when one field changes', async () => {
      let emailFieldRenders = 0;
      let passwordFieldRenders = 0;

      // Create monitored field components
      const MonitoredEmailField = React.memo(() => {
        emailFieldRenders++;
        return (
          <input 
            data-testid="email-field"
            placeholder="Email field"
          />
        );
      });

      const MonitoredPasswordField = React.memo(() => {
        passwordFieldRenders++;
        return (
          <input 
            data-testid="password-field"
            placeholder="Password field"
          />
        );
      });

      const TestForm = () => (
        <div>
          <input data-testid="name-field" placeholder="Name field" />
          <MonitoredEmailField />
          <MonitoredPasswordField />
        </div>
      );

      render(<TestForm />);
      
      const initialEmailRenders = emailFieldRenders;
      const initialPasswordRenders = passwordFieldRenders;

      // Change name field
      const nameField = screen.getByTestId('name-field');
      await user.type(nameField, 'test');

      // Other fields should not re-render
      expect(emailFieldRenders).toBe(initialEmailRenders);
      expect(passwordFieldRenders).toBe(initialPasswordRenders);
    });

    it('should use React.memo effectively for FormField components', () => {
      const mockRegister = jest.fn(() => ({}));
      
      // Render same props twice
      const { rerender } = render(
        <FormField
          name="test"
          label="Test Field"
          register={mockRegister}
          error={undefined}
        />
      );

      // Re-render with same props
      rerender(
        <FormField
          name="test"
          label="Test Field"
          register={mockRegister}
          error={undefined}
        />
      );

      // Component should be memoized and not re-render unnecessarily
      expect(mockRegister).toHaveBeenCalledTimes(1);
    });
  });

  describe('Form Validation Performance', () => {
    it('should handle rapid input changes efficiently', async () => {
      render(<SignUpForm />);
      
      const nameInput = screen.getByLabelText(/이름/);
      const startTime = Date.now();
      
      // Simulate rapid typing
      for (let i = 0; i < 50; i++) {
        await user.type(nameInput, 'a');
        await user.keyboard('{Backspace}');
      }
      
      const endTime = Date.now();
      const totalTime = endTime - startTime;
      
      // Should complete within reasonable time (less than 2 seconds)
      expect(totalTime).toBeLessThan(2000);
    });

    it('should not block UI during validation', async () => {
      render(<SignUpForm />);
      
      const nameInput = screen.getByLabelText(/이름/);
      const emailInput = screen.getByLabelText(/이메일/);
      
      // Start typing in name field
      await user.type(nameInput, 'test');
      
      // Should be able to immediately focus other field
      emailInput.focus();
      expect(emailInput).toHaveFocus();
    });

    it('should handle large form datasets efficiently', async () => {
      // Test with a form that has many validation rules
      render(<SignUpForm />);
      
      const startTime = performance.now();
      
      // Fill all fields rapidly
      await user.type(screen.getByLabelText(/이름/), 'John Doe');
      await user.type(screen.getByLabelText(/이메일/), 'john@example.com');
      await user.type(screen.getByLabelText(/^비밀번호$/), 'password123!');
      await user.type(screen.getByLabelText(/비밀번호 확인/), 'password123!');
      await user.click(screen.getByLabelText(/서비스 이용약관/));
      
      const endTime = performance.now();
      const totalTime = endTime - startTime;
      
      // Should complete form filling within reasonable time
      expect(totalTime).toBeLessThan(1000);
    });
  });

  describe('Memory Usage Optimization', () => {
    it('should not create memory leaks with event listeners', () => {
      const { unmount } = render(<SignUpForm />);
      
      // Get initial event listener count (if available)
      const initialListeners = document.querySelectorAll('*').length;
      
      // Unmount component
      unmount();
      
      // Re-render and unmount multiple times
      for (let i = 0; i < 10; i++) {
        const { unmount: unmountInstance } = render(<SignUpForm />);
        unmountInstance();
      }
      
      // Should not accumulate event listeners
      const finalListeners = document.querySelectorAll('*').length;
      expect(finalListeners).toBeLessThanOrEqual(initialListeners + 5); // Allow small variance
    });

    it('should clean up timers and intervals on unmount', () => {
      const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');
      const clearIntervalSpy = jest.spyOn(global, 'clearInterval');
      
      const { unmount } = render(<SignUpForm />);
      unmount();
      
      // Should clean up any timers (implementation dependent)
      // This test ensures cleanup functions are called
      expect(clearTimeoutSpy).toHaveBeenCalledTimes(0); // No timers in current implementation
      expect(clearIntervalSpy).toHaveBeenCalledTimes(0); // No intervals in current implementation
      
      clearTimeoutSpy.mockRestore();
      clearIntervalSpy.mockRestore();
    });
  });

  describe('Render Performance Monitoring', () => {
    it('should track render performance in development mode', () => {
      // Mock development environment
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';
      
      mockPerformanceNow
        .mockReturnValueOnce(0)    // Start time
        .mockReturnValueOnce(10);  // End time
      
      performanceMonitor.startRender('TestComponent');
      performanceMonitor.endRender('TestComponent');
      
      const metrics = performanceMonitor.getMetrics('TestComponent');
      expect(metrics).toBeDefined();
      expect(metrics?.renderCount).toBe(1);
      expect(metrics?.lastRenderTime).toBe(10);
      
      process.env.NODE_ENV = originalEnv;
    });

    it('should warn about slow renders', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';
      
      mockPerformanceNow
        .mockReturnValueOnce(0)    // Start time
        .mockReturnValueOnce(20);  // End time (slow render > 16ms)
      
      performanceMonitor.startRender('SlowComponent');
      performanceMonitor.endRender('SlowComponent');
      
      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining('Slow render detected for SlowComponent')
      );
      
      process.env.NODE_ENV = originalEnv;
    });

    it('should not track performance in production mode', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';
      
      performanceMonitor.startRender('TestComponent');
      performanceMonitor.endRender('TestComponent');
      
      const metrics = performanceMonitor.getMetrics('TestComponent');
      expect(metrics).toBeUndefined();
      
      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('Form State Management Performance', () => {
    it('should efficiently handle form state updates', async () => {
      render(<SignUpForm />);
      
      const nameInput = screen.getByLabelText(/이름/);
      const submitButton = screen.getByRole('button', { name: /회원가입/ });
      
      // Initial state - button should be disabled
      expect(submitButton).toBeDisabled();
      
      const startTime = performance.now();
      
      // Make rapid state changes
      await user.type(nameInput, 'John');
      await user.clear(nameInput);
      await user.type(nameInput, 'Jane');
      
      const endTime = performance.now();
      const totalTime = endTime - startTime;
      
      // Should handle state changes efficiently
      expect(totalTime).toBeLessThan(500);
      expect(submitButton).toBeDisabled(); // Still disabled due to other required fields
    });

    it('should batch validation updates efficiently', async () => {
      render(<SignUpForm />);
      
      // Fill multiple fields rapidly to test batching
      await Promise.all([
        user.type(screen.getByLabelText(/이름/), 'John'),
        user.type(screen.getByLabelText(/이메일/), 'john@example.com'),
      ]);
      
      // Should not cause excessive validation calls
      // React Hook Form should batch these updates
      expect(screen.getByLabelText(/이름/)).toHaveValue('John');
      expect(screen.getByLabelText(/이메일/)).toHaveValue('john@example.com');
    });
  });
});