
'use client';

import { useRouter } from 'next/navigation';
import { SCHOOLS } from '@/lib/constants';
import { useSchool } from '@/hooks/use-school';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, ChevronRight, Droplets } from 'lucide-react';
import Image from 'next/image';

export default function SchoolSelector() {
  const { setSchool } = useSchool();
  const router = useRouter();

  const handleSelectSchool = (schoolId: string) => {
    setSchool(schoolId);
    router.push(`/${schoolId}`);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 sm:p-6 md:p-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center mb-4">
            <Image
                src="/baha-logo.png.png"
                width={80}
                height={80}
                alt="BAHA Logo"
                className="h-20 w-20"
            />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold font-headline text-foreground">
          Welcome to BAHA
        </h1>
        <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">
          Real-time flood monitoring and evacuation guidance for your school. Please select your location to begin.
        </p>
      </div>

      <div className="w-full max-w-2xl space-y-4">
        {SCHOOLS.map((school) => (
          <Card
            key={school.id}
            className="cursor-pointer transition-all hover:shadow-lg hover:border-primary/50 hover:-translate-y-1"
            onClick={() => handleSelectSchool(school.id)}
          >
            <div className="flex items-center p-4">
              <div className="p-3 bg-secondary rounded-lg mr-4">
                <Building className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-grow">
                <p className="font-semibold text-lg text-foreground">{school.name}</p>
              </div>
              <ChevronRight className="h-6 w-6 text-muted-foreground" />
            </div>
          </Card>
        ))}
      </div>
       <footer className="mt-12 text-center text-muted-foreground text-sm">
        <p>&copy; {new Date().getFullYear()} BAHA Project. Stay safe.</p>
      </footer>
    </div>
  );
}
