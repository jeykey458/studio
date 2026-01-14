'use server';

import { getNearestSafeExit } from '@/ai/flows/dynamic-evacuation-route';
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

export async function findSafeRoute(
  input: DynamicEvacuationRouteInput
): Promise<ActionState> {
  const validation = findSafeRouteSchema.safeParse(input);

  if (!validation.success) {
    return { success: false, error: 'Invalid input.' };
  }

  try {
    const result = await getNearestSafeExit(validation.data);
    return { success: true, data: result };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    return { success: false, error: `Failed to get evacuation route: ${errorMessage}` };
  }
}
