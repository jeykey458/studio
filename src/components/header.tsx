'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BarChart3, Building, ChevronDown, LogOut } from 'lucide-react';
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
import { useAuth } from '@/firebase/provider';
import { useUser } from '@/firebase/auth/use-user';
import { signOut } from 'firebase/auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Image from 'next/image';

interface HeaderProps {
  schoolName: string;
  schoolId: string;
}

export default function Header({ schoolName, schoolId }: HeaderProps) {
  const { setSchool } = useSchool();
  const router = useRouter();
  const auth = useAuth();
  const user = useUser();

  const handleSwitchSchool = () => {
    setSchool(null);
    router.push('/');
  };

  const handleSignOut = async () => {
    if (auth) {
      await signOut(auth);
      router.push('/auth/login');
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center px-4 md:px-6">
        <Link href={`/${schoolId}`} className="flex items-center gap-2">
          <Image src="/baha-logo.png" alt="Baha Logo" width={28} height={28} />
          <span className="text-xl font-bold font-headline text-foreground">BAHA</span>
        </Link>
        <div className="mx-4 h-6 w-px bg-border" />
        <div className="flex items-center gap-2">
            <Building className="h-5 w-5 text-muted-foreground"/>
            <span className="font-medium text-foreground hidden sm:inline">{schoolName}</span>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/${schoolId}/history`}>
              <BarChart3 className="mr-2 h-4 w-4" />
              History
            </Link>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
               <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.photoURL || undefined} alt={user?.displayName || 'User'} />
                  <AvatarFallback>{user?.displayName?.charAt(0)}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
               <DropdownMenuSeparator />
               <DropdownMenuItem disabled>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.displayName}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSwitchSchool}>
                <Building className="mr-2 h-4 w-4" />
                <span>Switch School</span>
              </DropdownMenuItem>
               <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
