
import { LoginForm } from '@/components/auth/login-form';
import { BookOpen } from 'lucide-react';

export default function LoginPage() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center animated-gradient-bg p-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center text-white">
          <BookOpen className="mx-auto h-12 w-12" />
          <h1 className="mt-4 font-headline text-3xl font-bold tracking-tight">
            እንኳን በደህና መጡ
          </h1>
          <p className="mt-2 text-lg text-white/80">
            Welcome back! Please sign in to continue.
          </p>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
