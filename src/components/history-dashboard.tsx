'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import type { FloodHistoryEntry } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useMemo, useState, useEffect } from 'react';

interface HistoryDashboardProps {
  history: FloodHistoryEntry[];
}

interface FormattedHistoryEntry extends FloodHistoryEntry {
    date: string;
    time: string;
}

const chartConfig = {
  duration: {
    label: "Duration (min)",
  },
  zoneA: {
    label: "Zone A",
    color: "hsl(var(--chart-1))",
  },
  zoneB: {
    label: "Zone B",
    color: "hsl(var(--chart-2))",
  },
  zoneC: {
    label: "Zone C",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig

export default function HistoryDashboard({ history }: HistoryDashboardProps) {

  const { totalEvents, avgDuration, eventsPerZone, latestEventDate } = useMemo(() => {
    if (history.length === 0) {
        return { totalEvents: 0, avgDuration: 0, eventsPerZone: [], latestEventDate: null };
    }
    const totalDuration = history.reduce((sum, entry) => sum + entry.durationMinutes, 0);
    const zoneCounts = history.reduce((acc, entry) => {
        acc[entry.zone] = (acc[entry.zone] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const latestEvent = history.reduce((latest, current) => {
        return new Date(current.timestamp) > new Date(latest.timestamp) ? current : latest;
    });

    return {
        totalEvents: history.length,
        avgDuration: Math.round(totalDuration / history.length),
        eventsPerZone: [
            { zone: 'A', count: zoneCounts['A'] || 0 },
            { zone: 'B', count: zoneCounts['B'] || 0 },
            { zone: 'C', count: zoneCounts['C'] || 0 },
        ],
        latestEventDate: new Date(latestEvent.timestamp)
    };
  }, [history]);

  const [formattedTime, setFormattedTime] = useState('');
  const [formattedDate, setFormattedDate] = useState('');
  const [formattedHistory, setFormattedHistory] = useState<FormattedHistoryEntry[]>([]);

  useEffect(() => {
    if (latestEventDate) {
      setFormattedTime(latestEventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setFormattedDate(latestEventDate.toLocaleDateString([], { year: 'numeric', month: 'long', day: 'numeric' }));
    }
  }, [latestEventDate]);

  useEffect(() => {
      setFormattedHistory(
          history.map(entry => {
              const d = new Date(entry.timestamp);
              return {
                  ...entry,
                  date: d.toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' }),
                  time: d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              }
          }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      );
  }, [history]);

  const monthlyData = useMemo(() => {
    const months: Record<string, { zoneA: number, zoneB: number, zoneC: number }> = {};
    history.forEach(entry => {
        const month = new Date(entry.timestamp).toLocaleString('default', { month: 'short', year: '2-digit' });
        if (!months[month]) {
            months[month] = { zoneA: 0, zoneB: 0, zoneC: 0 };
        }
        if (entry.zone === 'A') months[month].zoneA += 1;
        if (entry.zone === 'B') months[month].zoneB += 1;
        if (entry.zone === 'C') months[month].zoneC += 1;
    });
    return Object.entries(months).map(([name, values]) => ({ name, ...values }));
  }, [history]);

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
            <CardHeader>
                <CardTitle>Total Flood Events</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-4xl font-bold">{totalEvents}</p>
                <p className="text-xs text-muted-foreground">Recorded since system installation</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Average Duration</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-4xl font-bold">{avgDuration} <span className="text-lg font-normal text-muted-foreground">min</span></p>
                <p className="text-xs text-muted-foreground">Average time to clear flood water</p>
            </CardContent>
        </Card>
         <Card>
            <CardHeader>
                <CardTitle>Events by Zone</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex justify-around">
                {eventsPerZone.map(item => (
                    <div key={item.zone} className="text-center">
                        <p className="text-3xl font-bold">{item.count}</p>
                        <p className="text-sm text-muted-foreground">Zone {item.zone}</p>
                    </div>
                ))}
                </div>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Last Flood Event</CardTitle>
            </CardHeader>
            <CardContent>
                {latestEventDate ? (
                    <>
                        <p className="text-4xl font-bold">{formattedTime || '...'}</p>
                        <p className="text-xs text-muted-foreground">{formattedDate || '...'}</p>
                    </>
                ) : (
                    <p className="text-4xl font-bold">N/A</p>
                )}
            </CardContent>
        </Card>

        <Card className="md:col-span-2 lg:col-span-4">
            <CardHeader>
                <CardTitle>Monthly Flood Events by Zone</CardTitle>
            </CardHeader>
            <CardContent>
            <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
                <BarChart accessibilityLayer data={monthlyData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="zoneA" fill="var(--color-zoneA)" radius={4} />
                    <Bar dataKey="zoneB" fill="var(--color-zoneB)" radius={4} />
                    <Bar dataKey="zoneC" fill="var(--color-zoneC)" radius={4} />
                </BarChart>
            </ChartContainer>
            </CardContent>
        </Card>

        <Card className="md:col-span-2 lg:col-span-4">
            <CardHeader>
                <CardTitle>Detailed Flood Log</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Zone</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Time</TableHead>
                            <TableHead className="text-right">Duration (min)</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {formattedHistory.length > 0 ? (
                            formattedHistory.map((entry) => (
                            <TableRow key={entry.timestamp + entry.zone}>
                                <TableCell className="font-medium">Zone {entry.zone}</TableCell>
                                <TableCell>{entry.date}</TableCell>
                                <TableCell>{entry.time}</TableCell>
                                <TableCell className="text-right">{entry.durationMinutes}</TableCell>
                            </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center">
                                    Loading history...
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
      </Card>
    </div>
  );
}
