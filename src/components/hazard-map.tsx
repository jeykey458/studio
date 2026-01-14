'use client';

import { useState, useEffect, useRef } from 'react';
import type { ZoneData, FloodStatus } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Search, ZoomIn, ZoomOut } from 'lucide-react';

interface HazardMapProps {
  zones: ZoneData[];
  mapUrl: string;
}

const statusColors: Record<FloodStatus, string> = {
  SAFE: 'hsl(120, 80%, 92%)', // Light green
  WARNING: 'hsl(48, 100%, 85%)', // Light yellow
  FLOODED: 'hsl(0, 100%, 90%)', // Light red
};

const statusBorderColors: Record<FloodStatus, string> = {
    SAFE: 'hsl(120, 60%, 70%)',
    WARNING: 'hsl(48, 90%, 65%)',
    FLOODED: 'hsl(0, 80%, 70%)',
};

export default function HazardMap({ zones, mapUrl }: HazardMapProps) {
  const [svgContent, setSvgContent] = useState('');
  const [viewBox, setViewBox] = useState({ x: 0, y: 0, width: 800, height: 600 });
  const [isPanning, setIsPanning] = useState(false);
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    fetch(mapUrl)
      .then((res) => res.text())
      .then(setSvgContent);
  }, [mapUrl]);

  useEffect(() => {
    if (svgRef.current) {
      zones.forEach(zone => {
        const el = svgRef.current?.querySelector(`#zone-${zone.id.toLowerCase()}`);
        if (el) {
          el.setAttribute('fill', statusColors[zone.status]);
          el.setAttribute('stroke', statusBorderColors[zone.status]);
          el.setAttribute('style', `transition: fill 0.5s ease, stroke 0.5s ease;`);
        }
      });
    }
  }, [zones, svgContent]);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = 1.1;
    const { width, height } = viewBox;
    const newWidth = e.deltaY < 0 ? width / zoomFactor : width * zoomFactor;
    const newHeight = e.deltaY < 0 ? height / zoomFactor : height * zoomFactor;
    
    if (svgRef.current) {
      const CTM = svgRef.current.getScreenCTM();
      if (CTM) {
          const { left, top } = svgRef.current.getBoundingClientRect();
          const mouseX = (e.clientX - left) / CTM.a;
          const mouseY = (e.clientY - top) / CTM.d;

          const newX = viewBox.x + (mouseX - viewBox.x) * (1 - newWidth / width);
          const newY = viewBox.y + (mouseY - viewBox.y) * (1 - newHeight / height);

          setViewBox({ x: newX, y: newY, width: newWidth, height: newHeight });
      }
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsPanning(true);
    setStartPoint({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning && svgRef.current) {
      const CTM = svgRef.current.getScreenCTM();
      if (CTM) {
        const dx = (e.clientX - startPoint.x) / CTM.a;
        const dy = (e.clientY - startPoint.y) / CTM.d;
        setViewBox({ ...viewBox, x: viewBox.x - dx, y: viewBox.y - dy });
        setStartPoint({ x: e.clientX, y: e.clientY });
      }
    }
  };
  
  const handleMouseUpOrLeave = () => {
    setIsPanning(false);
  };

  if (!svgContent) {
    return <Card className="aspect-video w-full flex items-center justify-center bg-muted/50"><Search className="h-8 w-8 text-muted-foreground animate-pulse"/></Card>;
  }

  return (
    <Card className={cn("w-full overflow-hidden touch-none select-none border-2 shadow-lg", isPanning ? 'cursor-grabbing' : 'cursor-grab')}>
      <svg
        ref={svgRef}
        viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        dangerouslySetInnerHTML={{ __html: svgContent }}
        className="w-full h-auto"
      />
    </Card>
  );
}
