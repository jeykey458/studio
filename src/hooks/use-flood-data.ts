'use client';

import { useState, useEffect, useRef } from 'react';
import type { ZoneData, FloodStatus, ZoneId } from '@/lib/types';
import { ZONES } from '@/lib/types';

const initialZones: ZoneData[] = ZONES.map(id => ({ id, status: 'SAFE' }));

const scenarios: FloodStatus[][] = [
  ['SAFE', 'SAFE', 'SAFE'],
  ['WARNING', 'SAFE', 'SAFE'],
  ['FLOODED', 'SAFE', 'SAFE'],
  ['FLOODED', 'WARNING', 'SAFE'],
  ['SAFE', 'WARNING', 'SAFE'],
  ['SAFE', 'FLOODED', 'SAFE'],
  ['SAFE', 'SAFE', 'WARNING'],
  ['WARNING', 'SAFE', 'WARNING'],
  ['FLOODED', 'FLOODED', 'SAFE'],
  ['SAFE', 'SAFE', 'SAFE'],
  ['FLOODED', 'FLOODED', 'FLOODED'],
];

const UPDATE_INTERVAL = 15000; // 15 seconds

export default function useFloodData() {
  const [zones, setZones] = useState<ZoneData[]>(initialZones);
  const [newlyFloodedZone, setNewlyFloodedZone] = useState<ZoneId | null>(null);
  const scenarioIndex = useRef(0);
  const previousZones = useRef<ZoneData[]>(initialZones);

  useEffect(() => {
    const interval = setInterval(() => {
      const currentScenario = scenarios[scenarioIndex.current];
      const newZones = ZONES.map((id, index) => ({
        id,
        status: currentScenario[index],
      }));

      setZones(newZones);
      
      let floodedZone: ZoneId | null = null;
      newZones.forEach(newZone => {
        const oldZone = previousZones.current.find(z => z.id === newZone.id);
        if (newZone.status === 'FLOODED' && oldZone?.status !== 'FLOODED') {
          floodedZone = newZone.id;
        }
      });
      setNewlyFloodedZone(floodedZone);
      
      // Clear the "newly flooded" state after a short period
      if(floodedZone) {
        setTimeout(() => setNewlyFloodedZone(null), 500);
      }

      previousZones.current = newZones;
      scenarioIndex.current = (scenarioIndex.current + 1) % scenarios.length;
    }, UPDATE_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  return { zones, newlyFloodedZone };
}
