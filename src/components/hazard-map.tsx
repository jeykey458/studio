'use client';

import { useState, useEffect, useRef } from 'react';
import type { ZoneData, FloodStatus } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Search, ZoomIn, ZoomOut } from 'lucide-react';

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

const INITIAL_VIEWBOX = { x: 0, y: 0, width: 800, height: 600 };

export default function HazardMap({ zones, mapUrl }: HazardMapProps) {
  const [svgContent, setSvgContent] = useState('');
  const [viewBox, setViewBox] = useState(INITIAL_VIEWBOX);
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

  const handleZoom = (factor: number) => {
    const { width, height, x, y } = viewBox;
    const newWidth = width * factor;
    const newHeight = height * factor;

    // Center the zoom
    const newX = x + (width - newWidth) / 2;
    const newY = y + (height - newHeight) / 2;

    setViewBox({ x: newX, y: newY, width: newWidth, height: newHeight });
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1 / 1.1 : 1.1;
    handleZoom(zoomFactor);
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

  const handleReset = () => {
    setViewBox(INITIAL_VIEWBOX);
  };

  if (!svgContent) {
    return <Card className="aspect-video w-full flex items-center justify-center bg-muted/50"><Search className="h-8 w-8 text-muted-foreground animate-pulse"/></Card>;
  }

  return (
    <Card className={cn("w-full overflow-hidden touch-none select-none border-2 shadow-lg relative", isPanning ? 'cursor-grabbing' : 'cursor-grab')}>
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
       <div className="absolute top-2 right-2 flex flex-col gap-2">
        <Button size="icon" onClick={() => handleZoom(1 / 1.2)} aria-label="Zoom In" variant="secondary" className="h-10 w-10">
          <ZoomIn className="h-5 w-5" />
        </Button>
        <Button size="icon" onClick={() => handleZoom(1.2)} aria-label="Zoom Out" variant="secondary" className="h-10 w-10">
          <ZoomOut className="h-5 w-5" />
        </Button>
        <Button size="icon" onClick={handleReset} aria-label="Reset View" variant="secondary" className="h-10 w-10">
          <RefreshCw className="h-5 w-5" />
        </Button>
      </div>
    </Card>
  );
}
