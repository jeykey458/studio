
'use client';

import { useState, useEffect } from 'react';
import { useAuth, useFirebaseApp } from '@/firebase/provider';
import {
  GoogleAuthProvider,
  signInWithRedirect,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useFirestore } from '@/firebase/provider';
import { doc, setDoc } from 'firebase/firestore';
import Image from 'next/image';
import { useUser } from '@/firebase/auth/use-user';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const auth = useAuth();
  const firestore = useFirestore();
  const firebaseApp = useFirebaseApp();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [error, setError] = useState<string | null>(null);
  const user = useUser();
  const router = useRouter();

  useEffect(() => {
    // If user is logged in, redirect them to the homepage.
    if (user) {
      router.replace('/');
    }
  }, [user, router]);

  const handleGoogleSignIn = async () => {
    if (auth) {
      const provider = new GoogleAuthProvider();
      try {
        await signInWithRedirect(auth, provider);
      } catch (error) {
        console.error('Error signing in with Google: ', error);
        setError('Failed to sign in with Google. Please try again.');
      }
    }
  };

  const handleEmailPasswordSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (auth && email && password) {
      try {
        await signInWithEmailAndPassword(auth, email, password);
        // Redirect is handled by the useEffect hook now.
      } catch (error: any) {
        console.error('Error signing in: ', error);
        setError(getFirebaseAuthErrorMessage(error.code));
      }
    }
  };

  const handleEmailPasswordSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (auth && firestore && email && password && fullName && contactNumber) {
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;

        // Update profile with full name
        await updateProfile(user, { displayName: fullName });

        // Save user data to Firestore
        const userDocRef = doc(firestore, 'users', user.uid);
        await setDoc(userDocRef, {
            id: user.uid,
            email: user.email,
            name: fullName,
            contactNumber: contactNumber,
        }, { merge: true });


        toast({
          title: 'Account Created!',
          description: 'You have been successfully signed up and logged in.',
        });
        // Redirect is handled by the useEffect hook watching the user state.
      } catch (error: any) {
        console.error('Error signing up: ', error);
        setError(getFirebaseAuthErrorMessage(error.code));
      }
    } else if (!fullName) {
      setError('Please enter your full name.');
    } else if (!contactNumber) {
        setError('Please enter your contact number.')
    }
  };

  const getFirebaseAuthErrorMessage = (errorCode: string) => {
    switch (errorCode) {
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/user-not-found':
        return 'No account found with this email. Please create an account.';
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'The password is incorrect.';
      case 'auth/email-already-in-use':
        return 'An account already exists with this email address. Please sign in instead.';
      case 'auth/weak-password':
        return 'The password must be at least 6 characters long.';
      case 'auth/operation-not-allowed':
        return 'Email/password accounts are not enabled. Please contact support.';
      case 'auth/configuration-not-found':
          return 'There was a problem with the authentication service configuration. Please try again later.';
      default:
        return 'An unexpected error occurred. Please try again.';
    }
  };

  const handleTabChange = () => {
    setEmail('');
    setPassword('');
    setFullName('');
    setContactNumber('');
    setError(null);
  };
  
  // While checking auth state, show a loader
  if (user === undefined) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="inline-flex items-center justify-center mb-4">
            <Image
              src="/baha-logo.png.png"
              width={40}
              height={40}
              alt="BAHA Logo"
              className="h-10 w-10"
            />
          </div>
          <CardTitle className="text-2xl font-bold">Welcome to BAHA</CardTitle>
          <CardDescription>
            Sign in or create an account to continue.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            defaultValue="signin"
            className="w-full"
            onValueChange={handleTabChange}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Create Account</TabsTrigger>
            </TabsList>
            <TabsContent value="signin">
              <form onSubmit={handleEmailPasswordSignIn}>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="email-signin">Email</Label>
                    <Input
                      id="email-signin"
                      type="email"
                      placeholder="m@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password-signin">Password</Label>
                    <Input
                      id="password-signin"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  {error && (
                    <Alert variant="destructive" className="text-xs">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  <Button type="submit" className="w-full">
                    Sign In
                  </Button>
                </div>
              </form>
            </TabsContent>
            <TabsContent value="signup">
              <form onSubmit={handleEmailPasswordSignUp}>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullname-signup">Full Name</Label>
                    <Input
                      id="fullname-signup"
                      type="text"
                      placeholder="Juan Dela Cruz"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>
                   <div className="space-y-2">
                    <Label htmlFor="contact-signup">Contact Number</Label>
                    <Input
                      id="contact-signup"
                      type="tel"
                      placeholder="09123456789"
                      required
                      value={contactNumber}
                      onChange={(e) => setContactNumber(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email-signup">Email</Label>
                    <Input
                      id="email-signup"
                      type="email"
                      placeholder="m@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password-signup">Password</Label>
                    <Input
                      id="password-signup"
                      type="password"
                      placeholder="Must be at least 6 characters"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  {error && (
                    <Alert variant="destructive" className="text-xs">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  <Button type="submit" className="w-full">
                    Create Account
                  </Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <Button
            onClick={handleGoogleSignIn}
            variant="outline"
            className="w-full"
          >
            Sign In with Google
          </Button>
        </CardContent>
        <CardFooter className="flex flex-col items-center justify-center text-xs text-muted-foreground pt-4">
            <p>Connected to Firebase Project:</p>
            <p className="font-mono text-center break-all">{firebaseApp?.options.projectId || 'Loading...'}</p>
        </CardFooter>
      </Card>
    </div>
  );
}
