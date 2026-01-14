'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { findSafeRoute } from '@/lib/actions';
import { ZONES, type ZoneData } from '@/lib/types';
import type { DynamicEvacuationRouteOutput } from '@/ai/flows/dynamic-evacuation-route';
import { Footprints, Loader2, MapPin, Route, Siren } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const formSchema = z.object({
  currentLocation: z.string().min(1, 'Please select your current zone.'),
});

interface EvacuationAIProps {
  zones: ZoneData[];
  schoolLayout: string;
}

export default function EvacuationAI({ zones, schoolLayout }: EvacuationAIProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DynamicEvacuationRouteOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentLocation: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setError(null);
    setResult(null);

    const floodedZoneIds = zones.filter((z) => z.status === 'FLOODED').map((z) => z.id);

    const response = await findSafeRoute({
      currentLocation: `Zone ${values.currentLocation}`,
      floodedZones: floodedZoneIds.length > 0 ? floodedZoneIds.map(id => `Zone ${id}`) : ['None'],
      schoolMap: schoolLayout,
    });

    if (response.success && response.data) {
      setResult(response.data);
    } else {
      setError(response.error || 'An unexpected error occurred.');
    }
    setLoading(false);
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-muted/30">
        <CardTitle>Route Finder</CardTitle>
        <CardDescription>Find the safest exit based on current flood levels.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="p-6 space-y-4">
            <FormField
              control={form.control}
              name="currentLocation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    What is your current zone?
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a zone" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {ZONES.map((zone) => (
                        <SelectItem key={zone} value={zone}>
                          Zone {zone}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="bg-muted/30 p-6">
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Calculating...
                </>
              ) : (
                <>
                 <Route className="mr-2 h-4 w-4" />
                  Find Safe Route
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>

      {result && (
        <div className="p-6 border-t">
          <Alert className="bg-accent/30 border-accent">
            <Footprints className="h-4 w-4" />
            <AlertTitle className="font-bold">Your Safest Route</AlertTitle>
            <AlertDescription className="mt-2 space-y-2">
               <p className="font-semibold">
                Proceed to: <span className="text-primary">{result.nearestSafeExit}</span>
               </p>
               <p>{result.routeDescription}</p>
            </AlertDescription>
          </Alert>
        </div>
      )}

      {error && (
         <div className="p-6 border-t">
            <Alert variant="destructive">
                <Siren className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
         </div>
      )}
    </Card>
  );
}
