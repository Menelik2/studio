import { AppSidebar } from '@/components/dashboard/app-sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="print:hidden">
        <AppSidebar />
      </div>
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14 print:pl-0 print:py-0">
        <main className="flex-1 flex flex-col gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 print:p-0 print:gap-0">
          {children}
        </main>
      </div>
    </div>
  );
}
