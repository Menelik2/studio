
import { LoginForm } from '@/components/auth/login-form';
import { BookOpen } from 'lucide-react';

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-8">
      <div className="flex w-full max-w-md flex-col items-center justify-center space-y-6">
        <div className="text-center">
          <BookOpen className="mx-auto h-12 w-12 text-primary" />
          <h1 className="mt-4 font-headline text-3xl font-bold tracking-tight text-primary">
            ባህር ዳር ፈ/ገ/ቅ/ጊዮርጊስ ካ/ሰ/ት/ቤት
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            የአስተዳዳሪ መግቢያ
          </p>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
