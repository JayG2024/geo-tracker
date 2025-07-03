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
        sendDefaultPii: true,
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

  logError(error: Partial<ErrorReport> & { metadata?: any }) {
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

    // Add additional context
    const detailedError = {
      ...errorReport,
      metadata: error.metadata || {},
      browser: {
        language: navigator.language,
        platform: navigator.platform,
        cookieEnabled: navigator.cookieEnabled,
        onLine: navigator.onLine,
        screenResolution: `${window.screen.width}x${window.screen.height}`,
        viewportSize: `${window.innerWidth}x${window.innerHeight}`,
        pixelRatio: window.devicePixelRatio
      },
      performance: {
        memory: (window.performance as any)?.memory ? {
          usedJSHeapSize: Math.round((window.performance as any).memory.usedJSHeapSize / 1048576),
          totalJSHeapSize: Math.round((window.performance as any).memory.totalJSHeapSize / 1048576),
          jsHeapSizeLimit: Math.round((window.performance as any).memory.jsHeapSizeLimit / 1048576)
        } : null,
        timing: window.performance?.timing ? {
          loadTime: window.performance.timing.loadEventEnd - window.performance.timing.navigationStart,
          domContentLoaded: window.performance.timing.domContentLoadedEventEnd - window.performance.timing.navigationStart
        } : null
      },
      appState: {
        route: window.location.pathname,
        hash: window.location.hash,
        search: window.location.search,
        referrer: document.referrer
      }
    };

    // Add to local log
    this.errorLog.unshift(detailedError as any);
    if (this.errorLog.length > this.maxLogSize) {
      this.errorLog.pop();
    }

    // Enhanced console logging
    console.group(`🚨 Error Handler: ${errorReport.errorId}`);
    console.error('Message:', errorReport.message);
    if (errorReport.stack) console.error('Stack:', errorReport.stack);
    if (errorReport.source) console.error('Source:', `${errorReport.source}:${errorReport.lineno}:${errorReport.colno}`);
    console.error('URL:', errorReport.url);
    console.error('Browser Context:', detailedError.browser);
    console.error('App State:', detailedError.appState);
    if (detailedError.metadata && Object.keys(detailedError.metadata).length > 0) {
      console.error('Additional Metadata:', detailedError.metadata);
    }
    console.groupEnd();

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

    // Store detailed error in localStorage
    try {
      const storedErrors = JSON.parse(localStorage.getItem('geo_tracker_errors') || '[]');
      storedErrors.unshift(detailedError);
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

  // Enhanced API error handler
  handleApiError(error: any, endpoint: string): string {
    const errorMessage = error.response?.data?.message || error.message || 'API request failed';
    
    return this.logError({
      message: `API Error: ${errorMessage}`,
      source: endpoint,
      stack: error.stack,
      lineno: 0,
      colno: 0,
      metadata: {
        endpoint,
        method: error.config?.method,
        status: error.response?.status,
        statusText: error.response?.statusText,
        responseData: error.response?.data,
        requestData: error.config?.data,
        headers: error.config?.headers,
        timeout: error.config?.timeout,
        errorCode: error.code
      }
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