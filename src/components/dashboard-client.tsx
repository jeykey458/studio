'use client';

import { useEffect } from 'react';
import useFloodData from '@/hooks/use-flood-data';
import { useToast } from '@/hooks/use-toast';
import ZoneStatusList from '@/components/zone-status-list';
import HazardMap from '@/components/hazard-map';
import EvacuationAI from '@/components/evacuation-ai';
import { Siren } from 'lucide-react';
import type { School } from '@/lib/types';
import { useUser } from '@/firebase/auth/use-user';
import { useRouter } from 'next/navigation';

export default function DashboardClient({ school }: { school: School }) {
  const { zones, newlyFloodedZone } = useFloodData();
  const { toast } = useToast();
  const user = useUser();
  const router = useRouter();

  useEffect(() => {
    if (newlyFloodedZone && user) {
        toast({
          variant: 'destructive',
          title: (
            <div className="flex items-center gap-2">
              <Siren className="h-5 w-5" />
              <span className="font-bold">Flood Alert! Zone {newlyFloodedZone} is flooding.</span>
            </div>
          ),
          description: "A new zone has been flooded. Please use the 'Route Finder' to determine the safest evacuation route.",
          duration: 20000,
        });
    }
  }, [newlyFloodedZone, toast, user]);

  useEffect(() => {
    if (user === null) {
      router.push('/auth/login');
    }
  }, [user, router]);


  if (!user) {
    return null; // Or a loading spinner
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-bold font-headline text-foreground">Hazard Map</h2>
          <HazardMap zones={zones} mapUrl={school.mapUrl} />
        </div>
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold font-headline text-foreground mb-6">Real-time Zone Status</h2>
            <ZoneStatusList zones={zones} />
          </div>
          <div>
            <h2 className="text-2xl font-bold font-headline text-foreground mb-6">Evacuation AI</h2>
            <EvacuationAI zones={zones} schoolLayout={school.mapLayoutDescription} />
          </div>
        </div>
      </div>
    </div>
  );
}
