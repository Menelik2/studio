
'use client';

import Link from 'next/link';
import {
  Book,
  BookOpen,
  CalendarCheck,
  ClipboardList,
  Home,
  LayoutDashboard,
  Menu,
  Package2,
  Settings,
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/dashboard/books', icon: Book, label: 'Books' },
  { href: '/dashboard/planner', icon: CalendarCheck, label: 'Planner' },
  { href: '/dashboard/planner-2', icon: ClipboardList, label: 'Planner 2' },
];

export function AppHeader() {
    const pathname = usePathname();

    return (
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 print:hidden sm:hidden">
            <Sheet>
            <SheetTrigger asChild>
                <Button size="icon" variant="outline" className="sm:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="sm:max-w-xs">
                <SheetHeader className="mb-6">
                  <SheetTitle>Navigation Menu</SheetTitle>
                  <SheetDescription>
                    Select a page to navigate to.
                  </SheetDescription>
                </SheetHeader>
                <nav className="grid gap-6 text-lg font-medium">
                <Link
                    href="/dashboard"
                    className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
                >
                    <BookOpen className="h-5 w-5 transition-all group-hover:scale-110" />
                    <span className="sr-only">Local Library</span>
                </Link>
                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            'flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground',
                             pathname === item.href && "text-foreground"
                        )}
                    >
                        <item.icon className="h-5 w-5" />
                        {item.label}
                    </Link>
                ))}
                </nav>
            </SheetContent>
            </Sheet>
        </header>
    );
}
