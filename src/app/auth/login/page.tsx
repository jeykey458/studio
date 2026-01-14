'use client';

import { useAuth } from '@/firebase/provider';
import { GoogleAuthProvider, signInWithRedirect } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Droplets } from 'lucide-react';

export default function LoginPage() {
  const auth = useAuth();

  const handleGoogleSignIn = async () => {
    if (auth) {
      const provider = new GoogleAuthProvider();
      try {
        await signInWithRedirect(auth, provider);
      } catch (error) {
        console.error('Error signing in with Google: ', error);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="inline-flex items-center justify-center mb-4">
             <Droplets className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Welcome to BAHA</CardTitle>
          <CardDescription>Sign in to access your school's flood monitoring dashboard.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleGoogleSignIn} className="w-full">
            Sign In with Google
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
