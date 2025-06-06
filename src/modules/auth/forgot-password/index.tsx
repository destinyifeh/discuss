'use client';

import {AppLogo} from '@/components/app-logo';
import {Button} from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {useGlobalStore} from '@/hooks/stores/use-global-store';
import clsx from 'clsx';
import Link from 'next/link';
import {useState} from 'react';
import {toast} from 'sonner';

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const {theme} = useGlobalStore(state => state);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    setIsSubmitting(true);

    try {
      // In a real app, this would send a reset password email
      // For demo purposes, we'll just simulate a successful request
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay
      toast.success('Password reset link sent to your email');
      setEmailSent(true);
    } catch (error) {
      console.error('Password reset request failed:', error);
      toast.error('Failed to send reset link. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="flex w-full md:max-w-4xl">
        <div
          className={clsx(
            'hidden md:flex flex-1 items-center justify-center rounded-l-lg p-8 text-white',
            {
              'bg-app/90': theme.type === 'dark',
              ' bg-app': theme.type === 'default',
            },
          )}>
          <div>
            {/* <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="w-16 h-16 text-white mb-4">
                <g>
                  <path
                    fill="currentColor"
                    d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
                  />
                </g>
              </svg> */}

            <AppLogo
              color="text-white"
              mdSize="md:text-4xl"
              center="text-left"
              title="Discussday Forum"
              mb="mb-4"
            />
            <h1 className="text-3xl font-bold mb-4">Reset your password</h1>
            <p className="text-lg mb-6">
              Enter your email address and we'll send you a link to reset your
              password.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="bg-white/20 p-1 rounded-full">✓</span>
                <span>Simple password recovery</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-white/20 p-1 rounded-full">✓</span>
                <span>Secure reset process</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-white/20 p-1 rounded-full">✓</span>
                <span>Quick account access</span>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full md:flex-1">
          <Card
            className={clsx('border-0 shadow-none', {
              'text-app-dark-text bg-app-dark-bg/10 border-app-dark-border hover:bg-app-dark-bg/10':
                theme.type === 'dark',
            })}>
            <CardHeader>
              <div className="flex justify-center mb-4">
                {/* <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="w-10 h-10 text-app">
                  <g>
                    <path
                      fill="currentColor"
                      d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
                    />
                  </g>
                </svg> */}

                <AppLogo color="text-app" mdSize="md:text-4xl" mb="0" />
              </div>
              <CardTitle className="text-2xl text-center">
                Reset your password
              </CardTitle>
              <CardDescription className="text-center">
                {emailSent
                  ? 'Check your inbox for the reset link'
                  : 'Enter your email to receive a password reset link'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!emailSent ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="email">
                      Email address
                    </label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className={clsx('form-input', {
                        'border-app-dark-border': theme.type === 'dark',
                      })}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-app hover:bg-app/90"
                    disabled={isSubmitting}>
                    {isSubmitting ? 'Sending...' : 'Send Reset Link'}
                  </Button>
                </form>
              ) : (
                <div className="text-center p-4">
                  <div className="bg-green-100 text-green-800 p-4 rounded-md mb-4">
                    Reset link sent! Check your email inbox.
                  </div>
                  <p>
                    Didn't receive an email? Check your spam folder or request
                    another link.
                  </p>
                  <Button
                    onClick={() => setEmailSent(false)}
                    variant="outline"
                    className="mt-4">
                    Send Another Link
                  </Button>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-center">
              <div className="text-center">
                <p className="text-sm text-app-gray">
                  Remember your password?{' '}
                  <Link href="/login" className="text-app hover:underline">
                    Back to Sign in
                  </Link>
                </p>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};
