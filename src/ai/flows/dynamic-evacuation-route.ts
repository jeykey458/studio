'use server';

/**
 * @fileOverview A dynamic evacuation route AI agent.
 *
 * - getNearestSafeExit - A function that determines the nearest safe evacuation exit based on the flooded zones.
 * - DynamicEvacuationRouteInput - The input type for the getNearestSafeExit function.
 * - DynamicEvacuationRouteOutput - The return type for the getNearestSafeExit function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DynamicEvacuationRouteInputSchema = z.object({
  floodedZones: z
    .array(z.string())
    .describe('An array of strings representing the zones that are flooded.'),
  currentLocation: z
    .string()
    .describe('The current location of the user (e.g., Zone A).'),
  schoolMap: z.string().describe('A description of the school layout.'),
});
export type DynamicEvacuationRouteInput = z.infer<
  typeof DynamicEvacuationRouteInputSchema
>;

const DynamicEvacuationRouteOutputSchema = z.object({
  nearestSafeExit: z
    .string()
    .describe('The nearest safe evacuation exit based on the flooded zones.'),
  routeDescription: z
    .string()
    .describe('A detailed description of the evacuation route.'),
});
export type DynamicEvacuationRouteOutput = z.infer<
  typeof DynamicEvacuationRouteOutputSchema
>;

export async function getNearestSafeExit(
  input: DynamicEvacuationRouteInput
): Promise<DynamicEvacuationRouteOutput> {
  return dynamicEvacuationRouteFlow(input);
}

const prompt = ai.definePrompt({
  name: 'dynamicEvacuationRoutePrompt',
  input: {schema: DynamicEvacuationRouteInputSchema},
  output: {schema: DynamicEvacuationRouteOutputSchema},
  prompt: `You are an expert in emergency evacuation planning. Given the
following information about the school, your current location, and the flooded
zones, determine the nearest safe evacuation exit and provide a detailed route
description.

School Layout: {{{schoolMap}}}
Current Location: {{{currentLocation}}}
Flooded Zones: {{#each floodedZones}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

Consider the following when determining the safest route:
- Avoid flooded zones at all costs.
- Choose the shortest possible path to a safe exit.
- Provide clear and concise instructions.

Output the nearest safe exit and a detailed description of the evacuation route.
`,
});

const dynamicEvacuationRouteFlow = ai.defineFlow(
  {
    name: 'dynamicEvacuationRouteFlow',
    inputSchema: DynamicEvacuationRouteInputSchema,
    outputSchema: DynamicEvacuationRouteOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
