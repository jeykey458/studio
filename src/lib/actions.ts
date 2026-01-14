'use server';

import type { DynamicEvacuationRouteInput, DynamicEvacuationRouteOutput } from '@/ai/flows/dynamic-evacuation-route';
import { z } from 'zod';

const findSafeRouteSchema = z.object({
    floodedZones: z.array(z.string()),
    currentLocation: z.string(),
    schoolMap: z.string(),
});

type ActionState = {
    success: boolean;
    data?: DynamicEvacuationRouteOutput;
    error?: string;
}

// NOTE: This function no longer uses AI and is deterministic based on the rules provided.
export async function findSafeRoute(
  input: DynamicEvacuationRouteInput
): Promise<ActionState> {
  const validation = findSafeRouteSchema.safeParse(input);

  if (!validation.success) {
    return { success: false, error: 'Invalid input.' };
  }

  try {
    const { floodedZones } = validation.data;
    const isAFlooded = floodedZones.includes('Zone A');
    const isBFlooded = floodedZones.includes('Zone B');
    const isCFlooded = floodedZones.includes('Zone C');

    let nearestSafeExit = '';
    let routeDescription = '';

    if (isAFlooded && isBFlooded && isCFlooded) {
      nearestSafeExit = 'None';
      routeDescription = 'All zones are flooded. No safe exit can be determined. Seek higher ground immediately and await rescue.';
    } else if (isAFlooded && isBFlooded) {
      nearestSafeExit = 'Exit 2';
      routeDescription = 'With Zones A and B flooded, your only safe path is towards Exit 2. Proceed with caution.';
    } else if (isAFlooded && isCFlooded) {
      nearestSafeExit = 'Exit 3';
      routeDescription = 'Zones A and C are flooded. The safest route is to Exit 3. Avoid the southern part of the school.';
    } else if (isBFlooded && isCFlooded) {
      nearestSafeExit = 'Exit 1';
      routeDescription = 'The entire eastern part of the school (Zones B and C) is flooded. Proceed directly to Exit 1.';
    } else if (isAFlooded) {
      nearestSafeExit = 'Exit 3';
      routeDescription = 'Zone A is flooded. Your nearest safe exit is Exit 3. An alternative is Exit 2. Avoid Exit 1.';
    } else if (isBFlooded) {
      nearestSafeExit = 'Exit 1';
      routeDescription = 'Zone B is flooded. The safest route is to Exit 1. Exit 2 is closer but may be risky. Avoid Exit 3.';
    } else if (isCFlooded) {
      nearestSafeExit = 'Exit 1';
      routeDescription = 'Zone C is flooded. The safest route is to Exit 1. Exit 3 is closer but you would need to pass near the flooded zone.';
    } else {
      // No zones are flooded
      nearestSafeExit = 'All exits are safe';
      routeDescription = 'There are no active flood warnings. All evacuation routes are clear. The nearest exit depends on your current location.';
    }

    const result: DynamicEvacuationRouteOutput = {
      nearestSafeExit,
      routeDescription,
    };
    
    return { success: true, data: result };

  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    return { success: false, error: `Failed to get evacuation route: ${errorMessage}` };
  }
}
