'use client';

import { useEffect } from 'react';
import useFloodData from '@/hooks/use-flood-data';
import { useToast } from '@/hooks/use-toast';
import ZoneStatusList from '@/components/zone-status-list';
import HazardMap from '@/components/hazard-map';
import EvacuationAI from '@/components/evacuation-ai';
import { Siren } from 'lucide-react';
import type { School } from '@/lib/types';

export default function DashboardClient({ school }: { school: School }) {
  const { zones, newlyFloodedZone } = useFloodData();
  const { toast } = useToast();

  useEffect(() => {
    if (newlyFloodedZone) {
      toast({
        variant: 'destructive',
        title: (
          <div className="flex items-center gap-2">
            <Siren className="h-5 w-5" />
            <span className="font-bold">Flood Alert!</span>
          </div>
        ),
        description: `Zone ${newlyFloodedZone} is flooding. Check the map for a safe evacuation route.`,
        duration: 10000,
      });
    }
  }, [newlyFloodedZone, toast]);

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
