import type { School, FloodHistoryEntry } from '@/lib/types';

export const SCHOOLS: School[] = [
  {
    id: 'cmc-elem',
    name: 'Cesar M. Cabahug Elementary School',
    mapUrl: '/school-map.svg',
    mapLayoutDescription: `The school has 3 zones (A, B, C) and 3 exits (1, 2, 3).
- Zone A is a large rectangular area on the west side.
- Zone B is a smaller rectangular area on the northeast.
- Zone C is a smaller rectangular area on the southeast.
- Exit 1 is on the far west wall, in the middle of Zone A.
- Exit 2 is on the far east wall, between Zone B and Zone C.
- Exit 3 is on the north wall, in Zone B.
- A hallway connects all zones. Access between zones is direct.`,
  },
  {
    id: 'mcnnhs',
    name: 'Mandaue City Comprehensive National High School',
    mapUrl: '/school-map.svg', // Using same map for demo
    mapLayoutDescription: `The school has 3 zones (A, B, C) and 3 exits (1, 2, 3).
- Zone A is on the west.
- Zone B is on the northeast.
- Zone C is on the southeast.
- Exit 1 is on the west wall.
- Exit 2 is on the east wall.
- Exit 3 is on the north wall.
- A central corridor connects all zones.`,
  },
  {
    id: 'umapad-elem',
    name: 'Umapad Elementary School',
    mapUrl: '/school-map.svg', // Using same map for demo
    mapLayoutDescription: `The school has 3 zones (A, B, C) and 3 exits (1, 2, 3).
- Zone A covers the western building.
- Zone B covers the northeastern building.
- Zone C covers the southeastern building.
- Exit 1 is west of Zone A.
- Exit 2 is east, between B and C.
- Exit 3 is north of Zone B.
- An open quad connects the zones.`,
  },
  {
    id: 'paknaan-elem',
    name: 'Paknaan Elementary School',
    mapUrl: '/school-map.svg', // Using same map for demo
    mapLayoutDescription: `The school contains three main areas: Zone A, Zone B, and Zone C, with three emergency exits.
- Zone A is the western-most section.
- Zone B is in the top-right (northeast).
- Zone C is in the bottom-right (southeast).
- Exit 1 is on the western edge of Zone A.
- Exit 2 is on the eastern edge, accessible from Zone B and C.
- Exit 3 is on the northern edge of Zone B.
- All zones are connected by covered walkways.`,
  },
];

export const MOCK_HISTORY: FloodHistoryEntry[] = [
    { timestamp: '2024-07-01T14:30:00Z', zone: 'A', durationMinutes: 45 },
    { timestamp: '2024-07-15T09:15:00Z', zone: 'C', durationMinutes: 120 },
    { timestamp: '2024-08-05T18:00:00Z', zone: 'A', durationMinutes: 30 },
    { timestamp: '2024-08-06T11:45:00Z', zone: 'B', durationMinutes: 60 },
    { timestamp: '2024-08-21T21:00:00Z', zone: 'C', durationMinutes: 90 },
    { timestamp: '2024-09-10T07:20:00Z', zone: 'A', durationMinutes: 25 },
    { timestamp: '2024-09-11T13:05:00Z', zone: 'B', durationMinutes: 75 },
    { timestamp: '2024-09-12T16:50:00Z', zone: 'C', durationMinutes: 40 },
];
