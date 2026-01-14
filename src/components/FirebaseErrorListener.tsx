'use client';

import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { errorEmitter } from '@/firebase/error-emitter';

export function FirebaseErrorListener() {
  const { toast } = useToast();

  useEffect(() => {
    const handleError = (error: any) => {
      console.error(error); // Also log it for debugging
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'An unexpected error occurred.',
      });
    };

    errorEmitter.on('permission-error', handleError);
    errorEmitter.on('error', handleError);

    return () => {
      errorEmitter.off('permission-error', handleError);
      errorEmitter.off('error', handleError);
    };
  }, [toast]);

  return null;
}
