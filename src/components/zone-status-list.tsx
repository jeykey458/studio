'use client';

import { Shield, ShieldAlert, ShieldX, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { ZoneData, FloodStatus } from '@/lib/types';

const statusConfig: Record<FloodStatus, { icon: React.ElementType; color: string; bgColor: string; borderColor: string }> = {
  SAFE: {
    icon: CheckCircle,
    color: 'text-green-700',
    bgColor: 'bg-green-100',
    borderColor: 'border-green-200'
  },
  WARNING: {
    icon: AlertTriangle,
    color: 'text-yellow-700',
    bgColor: 'bg-yellow-100',
    borderColor: 'border-yellow-200'
  },
  FLOODED: {
    icon: XCircle,
    color: 'text-red-700',
    bgColor: 'bg-red-100',
    borderColor: 'border-red-200'
  },
};

interface ZoneStatusListProps {
  zones: ZoneData[];
}

export default function ZoneStatusList({ zones }: ZoneStatusListProps) {
  if (!zones.length) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">No zone data available.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {zones.map((zone) => {
        const config = statusConfig[zone.status];
        return (
          <div
            key={zone.id}
            className={cn(
              'flex items-center p-4 rounded-lg border-2 transition-all duration-300',
              config.bgColor,
              config.borderColor
            )}
          >
            <config.icon className={cn('h-7 w-7 mr-4', config.color)} />
            <div className="flex-grow">
              <p className={cn('font-bold text-lg', config.color)}>Zone {zone.id}</p>
            </div>
            <p className={cn('font-semibold text-sm uppercase', config.color)}>{zone.status}</p>
          </div>
        );
      })}
    </div>
  );
}
