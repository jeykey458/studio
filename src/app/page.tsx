
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSchool } from '@/hooks/use-school';
import SchoolSelector from '@/components/school-selector';
import { Loader2 } from 'lucide-react';
import { useUser } from '@/firebase/auth/use-user';
import Image from 'next/image';

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
    // Only perform redirects once everything has loaded client-side
    if (!isClient || schoolLoading || userLoading) {
      return;
    }

    if (!user) {
      router.replace('/auth/login');
    } else if (school) {
      router.replace(`/${school.id}`);
    }
    // If user is logged in, but no school is selected, we'll fall through to render the SchoolSelector
  }, [isClient, schoolLoading, userLoading, user, school, router]);

  const isLoading = !isClient || schoolLoading || userLoading;
  const isRedirecting = !isLoading && (!user || school);

  // Show splash screen while loading or preparing to redirect.
  if (isLoading || isRedirecting) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-background text-center p-4">
        <Image
          src="/baha-logo-circle.png"
          width={120}
          height={120}
          alt="BAHA Logo"
          className="mb-8"
        />
        <h1 className="text-2xl md:text-3xl font-bold font-headline text-foreground max-w-2xl">
          BAHA: An IoT-Based Micro-Level Flood Monitoring and Alarm System for School Disaster
        </h1>
        <p className="mt-4 text-lg text-primary font-semibold">
          BAHA Knows Before It Shows.
        </p>
        <Loader2 className="h-8 w-8 animate-spin text-primary mt-8" />
      </div>
    );
  }

  // If we're done loading and not redirecting, it means we need the user to select a school.
  return <SchoolSelector />;
}
