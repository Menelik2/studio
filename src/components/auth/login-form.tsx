
'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { loginAction } from '@/lib/actions';
import { LogIn, AlertCircle, Mail, KeyRound } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { motion } from 'framer-motion';
import { Checkbox } from '../ui/checkbox';
import Link from 'next/link';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" aria-disabled={pending} disabled={pending}>
      {pending ? 'Logging in...' : 'Sign In'}
      <LogIn className="ml-2 h-4 w-4" />
    </Button>
  );
}

export function LoginForm() {
  const [state, formAction] = useActionState(loginAction, { error: '' });

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <Card className="w-full shadow-none border-0">
      <CardContent className="p-0">
        <motion.form 
          action={formAction} 
          className="space-y-4"
          variants={formVariants}
          initial="hidden"
          animate="visible"
        >
           {state?.error && (
            <motion.div variants={itemVariants}>
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Login Failed</AlertTitle>
                <AlertDescription>{state.error}</AlertDescription>
              </Alert>
            </motion.div>
          )}
          <motion.div variants={itemVariants} className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                id="email"
                name="email"
                type="email"
                placeholder="admin@example.com"
                defaultValue="admin@example.com"
                required
                className="pl-10"
                />
            </div>
          </motion.div>
          <motion.div variants={itemVariants} className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                id="password" 
                name="password"
                type="password" 
                placeholder="••••••••"
                required 
                className="pl-10"
                />
            </div>
          </motion.div>
          
          <motion.div variants={itemVariants} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Checkbox id="remember-me" />
              <Label htmlFor="remember-me" className="text-sm font-normal">Remember me</Label>
            </div>
            <Link href="#" className="text-sm text-primary hover:underline">
              Forgot password?
            </Link>
          </motion.div>

          <motion.div variants={itemVariants}>
            <SubmitButton />
          </motion.div>
        </motion.form>
      </CardContent>
    </Card>
  );
}
