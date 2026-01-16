
'use client';

import { useEffect, useState } from 'react';
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
import NotificationPermission from '@/components/notification-permission';
import { useFCM } from '@/hooks/use-fcm';

export default function DashboardClient({ school }: { school: School }) {
  const { zones, newlyFloodedZone } = useFloodData();
  const { toast } = useToast();
  const user = useUser();
  const router = useRouter();
  const { fcmToken, notificationPermissionStatus } = useFCM();
  const [showNotificationPrompt, setShowNotificationPrompt] = useState(false);

   useEffect(() => {
    // Show prompt if permission is not granted and we have a token (or status is determined)
    if (notificationPermissionStatus === 'default' || notificationPermissionStatus === 'denied') {
        setShowNotificationPrompt(true);
    } else {
        setShowNotificationPrompt(false);
    }
  }, [notificationPermissionStatus]);

  useEffect(() => {
    if (newlyFloodedZone && user) {
      const showToast = async () => {
        const floodedZoneIds = zones.filter((z) => z.status === 'FLOODED').map((z) => z.id);
        const routeResponse = await findSafeRoute({
          currentLocation: `Zone ${newlyFloodedZone}`,
          floodedZones: floodedZoneIds.length > 0 ? floodedZoneIds.map(id => `Zone ${id}`) : ['None'],
          schoolMap: school.mapLayoutDescription,
        });

        let description = "A new zone has been flooded. Please check evacuation routes.";
        if (routeResponse.success && routeResponse.data) {
          description = `The nearest safe exit is ${routeResponse.data.nearestSafeExit}. ${routeResponse.data.routeDescription}`;
        }
        
        const title = `Flood Alert! Zone ${newlyFloodedZone} is flooding.`;

        // In-app toast notification
        toast({
          variant: 'destructive',
          title: (
            <div className="flex items-center gap-2">
              <Siren className="h-5 w-5" />
              <span className="font-bold">{title}</span>
            </div>
          ),
          description: description,
          duration: 20000,
        });
        
        // Browser push notification
        if (notificationPermissionStatus === 'granted') {
             new Notification(title, { body: description, icon: '/baha-logo.png.png' });
        }
      }
      showToast();
    }
  }, [newlyFloodedZone, toast, user, zones, school.mapLayoutDescription, notificationPermissionStatus]);

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
       {showNotificationPrompt && <NotificationPermission onClose={() => setShowNotificationPrompt(false)} />}
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
