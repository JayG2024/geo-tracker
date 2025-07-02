import { useState, useEffect } from 'react';
import { DatabaseError } from '../services/database';

export function useAsync<T>(
  asyncFunction: () => Promise<T>,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    const executeAsync = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await asyncFunction();
        if (isMounted) {
          setData(result);
        }
      } catch (err) {
        if (isMounted) {
          if (err instanceof DatabaseError) {
            setError(err.message);
          } else {
            setError('An unexpected error occurred');
          }
          console.error('Database operation failed:', err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    executeAsync();

    return () => {
      isMounted = false;
    };
  }, dependencies);

  return { data, loading, error, refetch: () => executeAsync() };
}

export function useAsyncAction<T extends any[], R>(
  asyncFunction: (...args: T) => Promise<R>
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = async (...args: T): Promise<R | null> => {
    try {
      setLoading(true);
      setError(null);
      const result = await asyncFunction(...args);
      return result;
    } catch (err) {
      if (err instanceof DatabaseError) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
      console.error('Database action failed:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading, error, clearError: () => setError(null) };
}