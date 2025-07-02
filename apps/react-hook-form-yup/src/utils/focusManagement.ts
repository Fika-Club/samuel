/**
 * Focus Management Utilities
 * Provides keyboard navigation and accessibility enhancements
 */

/**
 * Focus the first invalid field in a form
 */
export const focusFirstInvalidField = (errors: Record<string, any>) => {
  const firstErrorField = Object.keys(errors)[0];
  if (firstErrorField) {
    const element = document.querySelector(`[name="${firstErrorField}"]`) as HTMLElement;
    if (element) {
      element.focus();
      // Scroll into view if needed
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
    }
  }
};

/**
 * Handle keyboard navigation for form elements
 */
export const handleFormKeyNavigation = (event: KeyboardEvent) => {
  // Handle Enter key to move to next field or submit
  if (event.key === 'Enter') {
    const target = event.target as HTMLElement;
    
    // Don't interfere with textarea or submit buttons
    if (target.tagName === 'TEXTAREA' || (target as HTMLInputElement).type === 'submit') {
      return;
    }
    
    // Prevent default form submission
    event.preventDefault();
    
    // Find next focusable element
    const focusableElements = getFocusableElements();
    const currentIndex = focusableElements.indexOf(target);
    
    if (currentIndex >= 0 && currentIndex < focusableElements.length - 1) {
      focusableElements[currentIndex + 1].focus();
    }
  }
};

/**
 * Get all focusable elements in the form
 */
const getFocusableElements = (): HTMLElement[] => {
  const selectors = [
    'input:not([disabled]):not([type="hidden"])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    'button:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
  ];
  
  const elements = document.querySelectorAll(selectors.join(', '));
  return Array.from(elements) as HTMLElement[];
};

/**
 * Trap focus within a container (useful for modal-like forms)
 */
export const trapFocus = (container: HTMLElement) => {
  const focusableElements = container.querySelectorAll(
    'input, select, textarea, button, [tabindex]:not([tabindex="-1"])'
  ) as NodeListOf<HTMLElement>;
  
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];
  
  const handleTabKey = (event: KeyboardEvent) => {
    if (event.key !== 'Tab') return;
    
    if (event.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
    } else {
      // Tab
      if (document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  };
  
  container.addEventListener('keydown', handleTabKey);
  
  // Return cleanup function
  return () => {
    container.removeEventListener('keydown', handleTabKey);
  };
};

/**
 * Announce status changes to screen readers
 */
export const announceToScreenReader = (message: string) => {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', 'polite');
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  
  // Add screen reader only styles
  announcement.style.position = 'absolute';
  announcement.style.left = '-10000px';
  announcement.style.width = '1px';
  announcement.style.height = '1px';
  announcement.style.overflow = 'hidden';
  
  document.body.appendChild(announcement);
  
  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
};