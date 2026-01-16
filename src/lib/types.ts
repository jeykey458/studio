export type FloodStatus = 'SAFE' | 'WARNING' | 'FLOODED';

export type ZoneId = 'A' | 'B' | 'C';

export const ZONES: ZoneId[] = ['A', 'B', 'C'];

export interface School {
  id: string;
  name: string;
  mapUrl: string;
  mapLayoutDescription: string;
}

export interface ZoneData {
  id: ZoneId;
  status: FloodStatus;
}

export interface FloodHistoryEntry {
  timestamp: string;
  zone: ZoneId;
  durationMinutes: number;
}
