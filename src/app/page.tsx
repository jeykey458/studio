'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSchool } from '@/hooks/use-school';
import SchoolSelector from '@/components/school-selector';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const { school, loading } = useSchool();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && !loading && school) {
      router.replace(`/${school.id}`);
    }
  }, [school, loading, router, isClient]);

  if (!isClient || loading || (school && !loading)) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Loading Your School...</p>
      </div>
    );
  }

  return <SchoolSelector />;
}
