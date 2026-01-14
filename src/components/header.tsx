'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BarChart3, Building, ChevronDown, Droplets, LogOut } from 'lucide-react';
import { useSchool } from '@/hooks/use-school';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface HeaderProps {
  schoolName: string;
  schoolId: string;
}

export default function Header({ schoolName, schoolId }: HeaderProps) {
  const { setSchool } = useSchool();
  const router = useRouter();

  const handleSwitchSchool = () => {
    setSchool(null);
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center px-4 md:px-6">
        <Link href={`/${schoolId}`} className="flex items-center gap-2">
          <Droplets className="h-7 w-7 text-primary" />
          <span className="text-xl font-bold font-headline text-foreground">BAHA</span>
        </Link>
        <div className="mx-4 h-6 w-px bg-border" />
        <div className="flex items-center gap-2">
            <Building className="h-5 w-5 text-muted-foreground"/>
            <span className="font-medium text-foreground hidden sm:inline">{schoolName}</span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/${schoolId}/history`}>
              <BarChart3 className="mr-2 h-4 w-4" />
              History
            </Link>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Menu
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSwitchSchool}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Switch School</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
