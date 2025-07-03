import React from 'react';
import { AlertCircle, X, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';

interface ErrorDisplayProps {
  error: string | Error;
  onDismiss?: () => void;
  type?: 'error' | 'warning' | 'info';
  title?: string;
  showDetails?: boolean;
  actions?: Array<{
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary';
  }>;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  onDismiss,
  type = 'error',
  title,
  showDetails = true,
  actions = []
}) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const errorMessage = error instanceof Error ? error.message : error;
  const errorStack = error instanceof Error ? error.stack : null;
  const errorId = `ERR-${Date.now()}`;

  const colors = {
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      icon: 'text-red-600',
      title: 'text-red-800',
      text: 'text-red-700'
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      icon: 'text-yellow-600',
      title: 'text-yellow-800',
      text: 'text-yellow-700'
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      icon: 'text-blue-600',
      title: 'text-blue-800',
      text: 'text-blue-700'
    }
  };

  const color = colors[type];

  const copyError = () => {
    const errorInfo = `Error ID: ${errorId}\nMessage: ${errorMessage}${errorStack ? `\n\nStack Trace:\n${errorStack}` : ''}`;
    navigator.clipboard.writeText(errorInfo);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`${color.bg} ${color.border} border rounded-lg p-4 mb-4`}>
      <div className="flex items-start">
        <AlertCircle className={`w-5 h-5 ${color.icon} mt-0.5 mr-3 flex-shrink-0`} />
        
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              {title && (
                <h3 className={`font-semibold ${color.title} mb-1`}>{title}</h3>
              )}
              <p className={`${color.text} text-sm`}>{errorMessage}</p>
              
              {showDetails && errorStack && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className={`mt-2 flex items-center text-sm ${color.text} hover:underline`}
                >
                  {isExpanded ? (
                    <>
                      <ChevronUp className="w-4 h-4 mr-1" />
                      Hide details
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4 mr-1" />
                      Show details
                    </>
                  )}
                </button>
              )}
            </div>
            
            <div className="flex items-center ml-4 space-x-2">
              <button
                onClick={copyError}
                className={`p-1 rounded hover:bg-white/50 transition-colors`}
                title="Copy error details"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className={`w-4 h-4 ${color.icon}`} />
                )}
              </button>
              
              {onDismiss && (
                <button
                  onClick={onDismiss}
                  className={`p-1 rounded hover:bg-white/50 transition-colors`}
                  title="Dismiss"
                >
                  <X className={`w-4 h-4 ${color.icon}`} />
                </button>
              )}
            </div>
          </div>
          
          {isExpanded && errorStack && (
            <div className="mt-3">
              <div className="bg-white/50 rounded p-3 border border-white">
                <p className="text-xs text-gray-600 mb-1">Error ID: {errorId}</p>
                <pre className="text-xs text-gray-700 whitespace-pre-wrap font-mono overflow-x-auto">
                  {errorStack}
                </pre>
              </div>
            </div>
          )}
          
          {actions.length > 0 && (
            <div className="mt-3 flex gap-2">
              {actions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.onClick}
                  className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                    action.variant === 'secondary'
                      ? 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                      : `bg-${type === 'error' ? 'red' : type === 'warning' ? 'yellow' : 'blue'}-600 text-white hover:bg-${type === 'error' ? 'red' : type === 'warning' ? 'yellow' : 'blue'}-700`
                  }`}
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorDisplay;