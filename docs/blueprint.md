# **App Name**: BAHA

## Core Features:

- Real-time Zone Status: Display real-time flood status (SAFE, WARNING, or FLOODED) for zones A, B, and C, based on data from the connected ESP32 float switch sensors via Firebase Realtime Database / Firestore.
- Hazard Map: Display a school floor plan with zones overlaid, changing colors (🟢 SAFE, 🟡 WARNING, 🔴 FLOODED) to indicate flood status.
- Evacuation Route AI: Dynamically determine and display the nearest safe evacuation exit based on the flooded zone(s) using a tool that evaluates the map layout and real-time flood data to ensure safe passage.
- Push Notifications: Send a push notification when a zone changes from SAFE or WARNING to FLOODED (e.g., '🚨 Flood Alert: Zone A is flooding. Please proceed to Exit 2 (with map)').
- Place Selection & Registration: Allow users to select Cesar M. Cabahug Elementary School, Mandaue City Comprehensive National High School, Umapad Elementary School, or Paknaan Elementary School and register to receive alerts specific to that location; save selected school locally; subscribe to school's notification topic.
- Interactive Map Navigation: Enable users to zoom in/out and move the hazard map screen for better viewing.
- Flooded History Dashboard: Show a flooded history, analytics dashboard.

## Style Guidelines:

- Primary color: Soft blue (#A0D2EB) to evoke a sense of safety and calm.
- Background color: Very light blue (#F0F8FF), close to white, creating a clean and open feel.
- Accent color: Light green (#90EE90), for highlighting safe zones and actions, providing visual reassurance.
- Body and headline font: 'PT Sans' (sans-serif) for a modern and accessible readability.
- Use clear, universally recognized icons for evacuation exits and flood status indicators.
- Prioritize the hazard map, ensuring it is prominently displayed and easy to interpret.
- Employ subtle animations to indicate changes in flood status, drawing attention without causing distraction.