import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { RefreshCw } from 'lucide-react';

interface SimpleCaptchaProps {
  onVerify: (isValid: boolean) => void;
}

export function SimpleCaptcha({ onVerify }: SimpleCaptchaProps) {
  const [captchaQuestion, setCaptchaQuestion] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [error, setError] = useState('');

  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    const operations = ['+', '-', '*'];
    const operation = operations[Math.floor(Math.random() * operations.length)];
    
    let answer;
    let question;
    
    switch (operation) {
      case '+':
        answer = num1 + num2;
        question = `${num1} + ${num2}`;
        break;
      case '-':
        answer = num1 - num2;
        question = `${num1} - ${num2}`;
        break;
      case '*':
        answer = num1 * num2;
        question = `${num1} × ${num2}`;
        break;
      default:
        answer = num1 + num2;
        question = `${num1} + ${num2}`;
    }
    
    setCaptchaQuestion(question);
    setCorrectAnswer(answer);
    setUserAnswer('');
    setError('');
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isCorrect = parseInt(userAnswer) === correctAnswer;
    
    if (isCorrect) {
      onVerify(true);
      setError('');
    } else {
      setError('Incorrect answer. Please try again.');
      generateCaptcha();
    }
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
      <h3 className="text-sm font-medium text-gray-700 mb-3">
        Verify you're human
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="bg-white px-4 py-2 rounded border border-gray-300 font-mono text-lg">
            {captchaQuestion} = ?
          </div>
          
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={generateCaptcha}
            className="gap-1"
          >
            <RefreshCw className="h-3 w-3" />
            New
          </Button>
        </div>
        
        <div>
          <input
            type="number"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="Enter your answer"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          {error && (
            <p className="mt-1 text-sm text-red-600">{error}</p>
          )}
        </div>
        
        <Button type="submit" className="w-full">
          Verify and Continue
        </Button>
      </form>
    </div>
  );
}

// For production, you'd want to use Google reCAPTCHA v3
export function ReCaptchaV3({ onVerify }: SimpleCaptchaProps) {
  useEffect(() => {
    // Load reCAPTCHA script
    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${process.env.VITE_RECAPTCHA_SITE_KEY}`;
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      // Execute reCAPTCHA
      window.grecaptcha.ready(() => {
        window.grecaptcha
          .execute(process.env.VITE_RECAPTCHA_SITE_KEY, { action: 'analyze' })
          .then((token: string) => {
            // In production, verify this token on your backend
            onVerify(true);
          });
      });
    };

    return () => {
      document.body.removeChild(script);
    };
  }, [onVerify]);

  return (
    <div className="text-xs text-gray-500 text-center">
      This site is protected by reCAPTCHA and the Google{' '}
      <a href="https://policies.google.com/privacy" className="underline">
        Privacy Policy
      </a>{' '}
      and{' '}
      <a href="https://policies.google.com/terms" className="underline">
        Terms of Service
      </a>{' '}
      apply.
    </div>
  );
}