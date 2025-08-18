
import { Button } from '@/components/ui/button';
import { BookOpen } from 'lucide-react';
import Link from 'next/link';

export default function WelcomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-3">
          <BookOpen className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-xl font-bold">Digital Library</h1>
            <p className="text-sm text-muted-foreground">Management System</p>
          </div>
        </div>
        <Button asChild>
          <Link href="/login">Go to Dashboard</Link>
        </Button>
      </header>
      <main className="flex-grow flex flex-col items-center justify-center text-center p-8">
        <div className="max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-headline font-bold mb-4">
            የባህርዳር ባህርዳር ፈ/ገ/ቅ/ጊዮርጊስ ፈ/ገ/ቅ/ጊዮርጊስ ካ/ሰ/ት ካ/ሰ/ት/ ቤት የማነ ጥበብ ዝግጅት ክፍል
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground">
            ግጥሞችን፣ ወግ ፣ መነባነብ ፤ ጽሑፎችን፣ ድራማዎችን እና መጣጥፎች ጨምሮ የእርስዎን የስነ-ጽሁፍ ስራዎች ስብስብ ለማደራጀት እና ለማስተዳደር አጠቃላይ የሆነ መተግበሪያ።
          </p>
        </div>
      </main>
    </div>
  );
}
