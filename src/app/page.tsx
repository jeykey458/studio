'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSchool } from '@/hooks/use-school';
import SchoolSelector from '@/components/school-selector';
import { Loader2 } from 'lucide-react';
import { useUser } from '@/firebase/auth/use-user';

export default function Home() {
  const router = useRouter();
  const { school, loading: schoolLoading } = useSchool();
  const user = useUser();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const userLoading = user === undefined;

  useEffect(() => {
    if (isClient && !schoolLoading) {
      if (school && user) {
        router.replace(`/${school.id}`);
      } else if (school && user === null) {
        // School is selected but user is not logged in, redirect to login
        router.replace('/auth/login');
      }
      // if no school is selected, stay on this page to show SchoolSelector
    }
  }, [school, user, schoolLoading, router, isClient]);

  if (!isClient || schoolLoading || userLoading) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Loading Your School...</p>
      </div>
    );
  }
  
  if (school && user) {
     return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Redirecting...</p>
      </div>
    );
  }


  return <SchoolSelector />;
}
