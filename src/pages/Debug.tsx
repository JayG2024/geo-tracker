import React, { useState, useEffect } from 'react';
import { AlertCircle, Trash2, RefreshCw } from 'lucide-react';

interface ErrorReport {
  errorId: string;
  message: string;
  timestamp: string;
  url: string;
  source?: string;
  stack?: string;
  lineno?: number;
  colno?: number;
}

export default function Debug() {
  const [errors, setErrors] = useState<ErrorReport[]>([]);
  const [envVars, setEnvVars] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Load errors from localStorage
    loadErrors();

    // Check environment variables
    checkEnvVars();
  }, []);

  const loadErrors = () => {
    try {
      const storedErrors = JSON.parse(localStorage.getItem('geo_tracker_errors') || '[]');
      setErrors(storedErrors);
    } catch (e) {
      console.error('Failed to load errors:', e);
    }
  };

  const checkEnvVars = () => {
    const vars = {
      'VITE_SERPER_API_KEY': !!import.meta.env.VITE_SERPER_API_KEY,
      'VITE_GOOGLE_API_KEY': !!import.meta.env.VITE_GOOGLE_API_KEY,
      'VITE_OPENAI_API_KEY': !!import.meta.env.VITE_OPENAI_API_KEY,
      'VITE_CLAUDE_API_KEY': !!import.meta.env.VITE_CLAUDE_API_KEY,
      'VITE_PERPLEXITY_API_KEY': !!import.meta.env.VITE_PERPLEXITY_API_KEY,
      'VITE_GEMINI_API_KEY': !!import.meta.env.VITE_GEMINI_API_KEY,
      'VITE_SUPABASE_URL': !!import.meta.env.VITE_SUPABASE_URL,
      'VITE_SUPABASE_ANON_KEY': !!import.meta.env.VITE_SUPABASE_ANON_KEY,
      'VITE_SENTRY_DSN': !!import.meta.env.VITE_SENTRY_DSN,
    };
    setEnvVars(vars);
  };

  const clearErrors = () => {
    localStorage.removeItem('geo_tracker_errors');
    setErrors([]);
  };

  const findError = (errorId: string) => {
    return errors.find(e => e.errorId === errorId);
  };

  // Check for specific error
  const specificError = findError('ERR-1751552949178-rrc1py5q7');

  return (
    <div className="container mx-auto p-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8">Debug Panel</h1>

      {/* Specific Error Check */}
      {specificError && (
        <div className="mb-8 border border-red-500 rounded-lg shadow-sm bg-white">
          <div className="p-6 border-b">
            <h3 className="text-red-600 text-xl font-semibold">
              <AlertCircle className="inline-block mr-2" />
              Found Error: ERR-1751552949178-rrc1py5q7
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-2">
              <p><strong>Message:</strong> {specificError.message}</p>
              <p><strong>Time:</strong> {new Date(specificError.timestamp).toLocaleString()}</p>
              <p><strong>URL:</strong> {specificError.url}</p>
              {specificError.source && <p><strong>Source:</strong> {specificError.source}</p>}
              {specificError.stack && (
                <div>
                  <strong>Stack Trace:</strong>
                  <pre className="bg-gray-100 p-2 rounded mt-1 text-xs overflow-x-auto">
                    {specificError.stack}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Environment Variables */}
      <div className="mb-8 border rounded-lg shadow-sm bg-white">
        <div className="p-6 border-b">
          <h3 className="text-xl font-semibold">Environment Variables Status</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(envVars).map(([key, isSet]) => (
              <div key={key} className="flex items-center justify-between p-2 rounded bg-gray-50">
                <span className="font-mono text-sm">{key}</span>
                <span className={`px-2 py-1 rounded text-xs ${isSet ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {isSet ? 'SET' : 'MISSING'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Errors */}
      <div className="border rounded-lg shadow-sm bg-white">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Recent Errors ({errors.length})</h3>
            <div className="space-x-2">
              <button onClick={loadErrors} className="px-3 py-1 text-sm border rounded hover:bg-gray-50 inline-flex items-center">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </button>
              <button onClick={clearErrors} className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 inline-flex items-center">
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All
              </button>
            </div>
          </div>
        </div>
        <div className="p-6">
          {errors.length === 0 ? (
            <p className="text-gray-500">No errors logged</p>
          ) : (
            <div className="space-y-4">
              {errors.map((error) => (
                <div key={error.errorId} className="border rounded p-4 bg-gray-50">
                  <div className="flex justify-between items-start mb-2">
                    <code className="text-xs font-mono text-gray-600">{error.errorId}</code>
                    <span className="text-xs text-gray-500">
                      {new Date(error.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="font-semibold text-red-600">{error.message}</p>
                  <p className="text-sm text-gray-600 mt-1">{error.url}</p>
                  {error.stack && (
                    <details className="mt-2">
                      <summary className="cursor-pointer text-sm text-blue-600">View Stack Trace</summary>
                      <pre className="bg-gray-100 p-2 rounded mt-1 text-xs overflow-x-auto">
                        {error.stack}
                      </pre>
                    </details>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* System Info */}
      <div className="mt-8 border rounded-lg shadow-sm bg-white">
        <div className="p-6 border-b">
          <h3 className="text-xl font-semibold">System Information</h3>
        </div>
        <div className="p-6">
          <div className="space-y-2 font-mono text-sm">
            <p>Mode: {import.meta.env.MODE}</p>
            <p>Base URL: {import.meta.env.BASE_URL}</p>
            <p>Production: {import.meta.env.PROD ? 'Yes' : 'No'}</p>
            <p>User Agent: {navigator.userAgent}</p>
            <p>Timestamp: {new Date().toISOString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}