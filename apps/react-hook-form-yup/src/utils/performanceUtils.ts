/**
 * Performance Utilities
 * Tools for measuring and optimizing form performance
 */

import React from 'react';

interface PerformanceMetrics {
  renderCount: number;
  lastRenderTime: number;
  totalRenderTime: number;
  averageRenderTime: number;
}

// Performance monitoring for development
export class FormPerformanceMonitor {
  private metrics: Map<string, PerformanceMetrics> = new Map();
  private renderStartTimes: Map<string, number> = new Map();

  /**
   * Start measuring render performance for a component
   */
  startRender(componentName: string): void {
    if (process.env.NODE_ENV === 'development') {
      this.renderStartTimes.set(componentName, performance.now());
    }
  }

  /**
   * End measuring render performance for a component
   */
  endRender(componentName: string): void {
    if (process.env.NODE_ENV === 'development') {
      const startTime = this.renderStartTimes.get(componentName);
      if (startTime) {
        const endTime = performance.now();
        const renderTime = endTime - startTime;
        
        const existing = this.metrics.get(componentName) || {
          renderCount: 0,
          lastRenderTime: 0,
          totalRenderTime: 0,
          averageRenderTime: 0
        };

        const newMetrics: PerformanceMetrics = {
          renderCount: existing.renderCount + 1,
          lastRenderTime: renderTime,
          totalRenderTime: existing.totalRenderTime + renderTime,
          averageRenderTime: (existing.totalRenderTime + renderTime) / (existing.renderCount + 1)
        };

        this.metrics.set(componentName, newMetrics);
        this.renderStartTimes.delete(componentName);

        // Log performance warnings for slow renders
        if (renderTime > 16) { // More than one frame at 60fps
          console.warn(`Slow render detected for ${componentName}: ${renderTime.toFixed(2)}ms`);
        }
      }
    }
  }

  /**
   * Get performance metrics for a component
   */
  getMetrics(componentName: string): PerformanceMetrics | undefined {
    return this.metrics.get(componentName);
  }

  /**
   * Get all performance metrics
   */
  getAllMetrics(): Map<string, PerformanceMetrics> {
    return new Map(this.metrics);
  }

  /**
   * Reset metrics for a component
   */
  resetMetrics(componentName?: string): void {
    if (componentName) {
      this.metrics.delete(componentName);
      this.renderStartTimes.delete(componentName);
    } else {
      this.metrics.clear();
      this.renderStartTimes.clear();
    }
  }

  /**
   * Log performance summary
   */
  logSummary(): void {
    if (process.env.NODE_ENV === 'development') {
      console.group('Form Performance Summary');
      this.metrics.forEach((metrics, componentName) => {
        console.log(`${componentName}:`, {
          renders: metrics.renderCount,
          avgTime: `${metrics.averageRenderTime.toFixed(2)}ms`,
          lastTime: `${metrics.lastRenderTime.toFixed(2)}ms`,
          totalTime: `${metrics.totalRenderTime.toFixed(2)}ms`
        });
      });
      console.groupEnd();
    }
  }
}

// Global performance monitor instance
export const performanceMonitor = new FormPerformanceMonitor();

/**
 * React hook for monitoring component render performance
 */
export const useRenderPerformance = (componentName: string) => {
  if (process.env.NODE_ENV === 'development') {
    performanceMonitor.startRender(componentName);
    
    // Use useEffect to measure render completion
    React.useEffect(() => {
      performanceMonitor.endRender(componentName);
    });
  }
};

/**
 * Higher-order component for performance monitoring
 */
export const withPerformanceMonitoring = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  componentName?: string
) => {
  const displayName = componentName || WrappedComponent.displayName || WrappedComponent.name || 'Component';
  
  const WithPerformanceMonitoring = React.memo((props: P) => {
    useRenderPerformance(displayName);
    return React.createElement(WrappedComponent, props);
  });

  WithPerformanceMonitoring.displayName = `withPerformanceMonitoring(${displayName})`;
  
  return WithPerformanceMonitoring;
};

/**
 * Debounce utility for performance optimization
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Throttle utility for performance optimization
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * Memory usage monitoring
 */
export const measureMemoryUsage = (): void => {
  if (process.env.NODE_ENV === 'development' && 'memory' in performance) {
    const memInfo = (performance as any).memory;
    console.log('Memory Usage:', {
      used: `${(memInfo.usedJSHeapSize / 1048576).toFixed(2)} MB`,
      total: `${(memInfo.totalJSHeapSize / 1048576).toFixed(2)} MB`,
      limit: `${(memInfo.jsHeapSizeLimit / 1048576).toFixed(2)} MB`
    });
  }
};

/**
 * Form validation performance testing
 */
export const testValidationPerformance = async (
  validationFunction: () => Promise<any> | any,
  iterations: number = 1000
): Promise<{ averageTime: number; totalTime: number }> => {
  const times: number[] = [];
  
  for (let i = 0; i < iterations; i++) {
    const start = performance.now();
    await validationFunction();
    const end = performance.now();
    times.push(end - start);
  }
  
  const totalTime = times.reduce((sum, time) => sum + time, 0);
  const averageTime = totalTime / iterations;
  
  return { averageTime, totalTime };
};