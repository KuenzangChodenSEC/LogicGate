import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu, AlertTriangle } from 'lucide-react';
import Sidebar from './Sidebar';
import { useApp } from '@/contexts/AppContext';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export default function AppLayout() {
  const { storageOk } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Desktop sidebar */}
      {/* Desktop sidebar stays fixed while the page content scrolls. */}
      <div className="hidden md:block w-64 shrink-0" aria-hidden="true" />
      <div className="fixed inset-y-0 left-0 z-40 hidden md:block w-64">
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="flex-1 min-w-0 flex flex-col min-h-screen">
        {/* Mobile header */}
        <header className="md:hidden flex items-center gap-3 px-4 py-3 bg-white border-b border-border shrink-0">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <button className="p-1.5 text-muted-foreground hover:text-foreground">
                <Menu size={20} />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64 bg-white border-r border-border">
              <Sidebar open={true} onClose={() => setMobileOpen(false)} />
            </SheetContent>
          </Sheet>
          <span className="text-foreground font-semibold text-sm">Logic Gate Hub</span>
        </header>

        {/* Storage warning */}
        {!storageOk && (
          <div className="flex items-center gap-2 px-4 py-2 bg-destructive/10 border-b border-destructive/20 text-destructive text-sm">
            <AlertTriangle size={14} />
            Progress cannot be saved in this browser.
          </div>
        )}

        {/* Page content */}
        <main className="flex-1 overflow-x-hidden page-transition">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
