// Global Error Handler with Sentry Integration
import * as Sentry from '@sentry/react';

interface ErrorReport {
  message: string;
  stack?: string;
  source?: string;
  lineno?: number;
  colno?: number;
  timestamp: string;
  userAgent: string;
  url: string;
  errorId: string;
}

class ErrorHandler {
  private static instance: ErrorHandler;
  private errorLog: ErrorReport[] = [];
  private maxLogSize = 50;

  private constructor() {
    this.setupGlobalHandlers();
    this.initializeSentry();
  }

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  private initializeSentry() {
    const sentryDsn = import.meta.env.VITE_SENTRY_DSN;
    
    if (sentryDsn && sentryDsn !== 'your_sentry_dsn_here') {
      Sentry.init({
        dsn: sentryDsn,
        environment: import.meta.env.MODE,
        integrations: [
          Sentry.browserTracingIntegration(),
          Sentry.replayIntegration({
            maskAllText: false,
            blockAllMedia: false,
          }),
        ],
        tracesSampleRate: import.meta.env.PROD ? 0.1 : 1.0,
        replaysSessionSampleRate: 0.1,
        replaysOnErrorSampleRate: 1.0,
        beforeSend(event, hint) {
          // Filter out known non-critical errors
          if (event.exception?.values?.[0]?.value?.includes('ResizeObserver')) {
            return null;
          }
          
          // Add custom context
          event.tags = {
            ...event.tags,
            version: '1.0.0',
            feature: 'geo-tracker'
          };
          
          return event;
        }
      });

      console.log('✅ Sentry error tracking initialized');
    } else {
      console.log('⚠️ Sentry DSN not configured - error tracking disabled');
    }
  }

  private setupGlobalHandlers() {
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled promise rejection:', event.reason);
      this.logError({
        message: `Unhandled Promise Rejection: ${event.reason}`,
        stack: event.reason?.stack || 'No stack trace available',
        source: 'unhandledrejection'
      });
      
      // Prevent default browser behavior
      event.preventDefault();
    });

    // Handle global errors
    window.addEventListener('error', (event) => {
      this.logError({
        message: event.message,
        source: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack
      });
      
      // Don't prevent default for syntax errors
      if (!event.message.includes('Syntax')) {
        event.preventDefault();
      }
    });
  }

  logError(error: Partial<ErrorReport>) {
    const errorReport: ErrorReport = {
      message: error.message || 'Unknown error',
      stack: error.stack,
      source: error.source,
      lineno: error.lineno,
      colno: error.colno,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      errorId: `ERR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };

    // Add to local log
    this.errorLog.unshift(errorReport);
    if (this.errorLog.length > this.maxLogSize) {
      this.errorLog.pop();
    }

    // Log to console in development
    if (import.meta.env.DEV) {
      console.group(`🚨 Error Handler: ${errorReport.errorId}`);
      console.error('Message:', errorReport.message);
      if (errorReport.stack) console.error('Stack:', errorReport.stack);
      if (errorReport.source) console.error('Source:', `${errorReport.source}:${errorReport.lineno}:${errorReport.colno}`);
      console.error('URL:', errorReport.url);
      console.groupEnd();
    }

    // Send to Sentry if available
    if (window.Sentry) {
      Sentry.captureException(new Error(errorReport.message), {
        tags: {
          errorId: errorReport.errorId,
          source: errorReport.source || 'unknown'
        },
        extra: {
          ...errorReport
        }
      });
    }

    // Store in localStorage for debugging
    try {
      const storedErrors = JSON.parse(localStorage.getItem('geo_tracker_errors') || '[]');
      storedErrors.unshift(errorReport);
      if (storedErrors.length > 10) storedErrors.pop();
      localStorage.setItem('geo_tracker_errors', JSON.stringify(storedErrors));
    } catch (e) {
      console.error('Failed to store error in localStorage:', e);
    }

    return errorReport.errorId;
  }

  getErrorLog(): ErrorReport[] {
    return this.errorLog;
  }

  clearErrorLog() {
    this.errorLog = [];
    localStorage.removeItem('geo_tracker_errors');
  }

  getStoredErrors(): ErrorReport[] {
    try {
      return JSON.parse(localStorage.getItem('geo_tracker_errors') || '[]');
    } catch {
      return [];
    }
  }

  // Helper method for API errors
  handleApiError(error: any, endpoint: string): string {
    const errorMessage = error.response?.data?.message || error.message || 'API request failed';
    
    return this.logError({
      message: `API Error: ${errorMessage}`,
      source: endpoint,
      stack: error.stack,
      lineno: 0,
      colno: 0
    });
  }

  // Helper method for async errors
  handleAsyncError(error: Error, context: string): string {
    return this.logError({
      message: `Async Error in ${context}: ${error.message}`,
      stack: error.stack,
      source: context
    });
  }
}

// Export singleton instance
export const errorHandler = ErrorHandler.getInstance();

// Export types
export type { ErrorReport };

// Convenience methods
export const logError = (error: Partial<ErrorReport>) => errorHandler.logError(error);
export const handleApiError = (error: any, endpoint: string) => errorHandler.handleApiError(error, endpoint);
export const handleAsyncError = (error: Error, context: string) => errorHandler.handleAsyncError(error, context);

// Make available globally for debugging
if (import.meta.env.DEV) {
  (window as any).errorHandler = errorHandler;
}