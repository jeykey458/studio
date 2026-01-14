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
import { findSafeRoute } from '@/lib/actions';

export default function DashboardClient({ school }: { school: School }) {
  const { zones, newlyFloodedZone } = useFloodData();
  const { toast } = useToast();
  const user = useUser();
  const router = useRouter();

  useEffect(() => {
    if (newlyFloodedZone && user) {
        const floodedZones = zones.filter(z => z.status === 'FLOODED').map(z => `Zone ${z.id}`);
        // For simplicity, assuming user is in a non-flooded zone. 
        // A real app would need to get user's actual location.
        const safeZones = zones.filter(z => z.status !== 'FLOODED');
        const userLocation = safeZones.length > 0 ? `Zone ${safeZones[0].id}` : 'Entrance';

        findSafeRoute({
          currentLocation: userLocation,
          floodedZones: floodedZones.length > 0 ? floodedZones : ['None'],
          schoolMap: school.mapLayoutDescription,
        }).then(response => {
            let routeDescription = "Please check the map for a safe evacuation route.";
            if (response.success && response.data) {
                routeDescription = `Nearest safe exit: ${response.data.nearestSafeExit}. ${response.data.routeDescription}`;
            }

            toast({
              variant: 'destructive',
              title: (
                <div className="flex items-center gap-2">
                  <Siren className="h-5 w-5" />
                  <span className="font-bold">Flood Alert! Zone {newlyFloodedZone} is flooding.</span>
                </div>
              ),
              description: routeDescription,
              duration: 20000,
            });
        })
    }
  }, [newlyFloodedZone, toast, user, zones, school]);

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
