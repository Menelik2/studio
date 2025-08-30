
'use client';

import { LoginForm } from '@/components/auth/login-form';
import { BookOpen, AlertCircle } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Suspense } from 'react';

function LoginError() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  if (!error) {
    return null;
  }

  return (
    <Alert variant="destructive" className="bg-white/20 border-white/30 text-white backdrop-blur-sm">
        <AlertCircle className="h-4 w-4 !text-white" />
        <AlertTitle>Login Failed</AlertTitle>
        <AlertDescription className="!text-white/90">
            {error}
        </AlertDescription>
    </Alert>
  );
}

export default function LoginPage() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center animated-gradient-bg p-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center text-white">
          <BookOpen className="mx-auto h-12 w-12" />
          <h1 className="mt-4 font-headline text-3xl font-bold tracking-tight">
            እንኳን በደኅና መጡ !
          </h1>
          <p className="mt-2 text-lg text-white/80">
            ባህር ዳር ፈ/ገ/ቅ/ጊዮርጊስ ካ/ሰ/ት/ቤት
          </p>
        </div>
        <Suspense fallback={<div>Loading...</div>}>
            <LoginError />
        </Suspense>
        <LoginForm />
      </div>
    </main>
  );
}
