import { LoginForm } from '@/components/auth/login-form';
import Image from 'next/image';
import { BookOpen } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <main className="flex min-h-screen w-full flex-col lg:flex-row">
      <div className="relative flex-1 hidden lg:flex items-center justify-center animated-gradient-bg p-8">
         <div className="absolute top-4 left-4">
          <Button asChild variant="ghost">
             <Link href="/" className="flex items-center gap-2 text-white">
                <BookOpen className="h-6 w-6" />
                <span className="font-bold text-lg">Local Library Lore</span>
             </Link>
          </Button>
         </div>
         <div className="relative w-full max-w-md">
            <Image 
                src="https://placehold.co/600x400.png"
                alt="Library illustration"
                width={600}
                height={400}
                className="rounded-lg shadow-2xl"
                data-ai-hint="library books"
            />
         </div>
      </div>
      <div className="flex w-full lg:w-1/2 flex-col items-center justify-center bg-background p-8">
        <div className="flex w-full max-w-md flex-col items-center justify-center space-y-6">
          <div className="text-center">
            <h1 className="mt-4 font-headline text-3xl font-bold tracking-tight text-primary">
              የአስተዳዳሪ መግቢያ
            </h1>
            <p className="mt-2 text-lg text-muted-foreground">
              Welcome back! Please sign in to continue.
            </p>
          </div>
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
