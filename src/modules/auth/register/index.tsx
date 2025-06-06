'use client';

import {useState} from 'react';

import {AppLogo} from '@/components/app-logo';
import {Avatar, AvatarFallback} from '@/components/ui/avatar';
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
import {useAuthStore} from '@/hooks/stores/use-auth-store';
import {useGlobalStore} from '@/hooks/stores/use-global-store';
import clsx from 'clsx';
import {Camera} from 'lucide-react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {toast} from 'sonner';
export const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const {register, loginWithGoogle} = useAuthStore(state => state);
  const navigate = useRouter();
  const {theme, setTheme} = useGlobalStore(state => state);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !displayName || !password || !confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (username.includes(' ')) {
      toast.error('Username cannot contain spaces');
      return;
    }

    setIsSubmitting(true);

    try {
      await register(username, password, displayName);
      navigate.push('/home');
    } catch (error) {
      console.error('Registration failed:', error);
      // Error is already handled in the auth context
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleRegister = async () => {
    setIsGoogleLoading(true);

    try {
      await loginWithGoogle();
      navigate.push('/home');
    } catch (error) {
      console.error('Google registration failed:', error);
      // Error is already handled in the auth context
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const getInitials = () => {
    if (!displayName) return '?';
    return displayName.charAt(0).toUpperCase();
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
            <h1 className="text-3xl font-bold mb-4">Join our community</h1>
            <p className="text-lg mb-6">
              Create an account to start sharing your thoughts and connect with
              others.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="bg-white/20 p-1 rounded-full">✓</span>
                <span>Create and share posts</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-white/20 p-1 rounded-full">✓</span>
                <span>Connect with other users</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-white/20 p-1 rounded-full">✓</span>
                <span>Join topic-specific discussions</span>
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

                <AppLogo color="text-app" mdSize="md:text-4xl" mb="mb-0" />
              </div>
              <CardTitle className="text-2xl">Create your account</CardTitle>
              <CardDescription>
                Enter your information to sign up
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2 border-gray-300"
                  onClick={handleGoogleRegister}
                  disabled={isGoogleLoading}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="20"
                    height="20">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.79-.07-1.54-.19-2.27h-11.3v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"
                    />
                    <path
                      fill="#34A853"
                      d="M12.255 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96h-3.98v3.09c1.97 3.92 6.02 6.62 10.71 6.62z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.525 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29v-3.09h-3.98c-.8 1.61-1.26 3.41-1.26 5.38s.46 3.77 1.26 5.38l3.98-3.09z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12.255 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42c-2.08-1.95-4.81-3.13-8.02-3.13-4.69 0-8.74 2.7-10.71 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"
                    />
                  </svg>
                  {isGoogleLoading
                    ? 'Signing up with Google...'
                    : 'Sign up with Google'}
                </Button>
              </div>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <span
                    className={clsx('w-full border-t ', {
                      'border-app-dark-border': theme.type === 'dark',
                      'border-gray-300': theme.type === 'default',
                    })}
                  />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Or sign up with email
                  </span>
                </div>
              </div>

              <form onSubmit={handleRegister} className="space-y-4">
                {/* Profile Photo Upload */}
                <div className="flex flex-col items-center mb-4">
                  <div className="relative">
                    <Avatar className="h-20 w-20">
                      <AvatarFallback className="bg-app/20 text-app text-2xl">
                        {getInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="absolute bottom-0 right-0 rounded-full h-8 w-8 bg-white border border-app-border">
                      <Camera size={16} />
                      <span className="sr-only">Upload profile photo</span>
                    </Button>
                  </div>
                  <div className="mt-2 text-center">
                    <label
                      htmlFor="profilePhoto"
                      className="text-sm text-app cursor-pointer hover:underline">
                      Upload a profile photo
                    </label>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="email">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={displayName}
                    onChange={e => setDisplayName(e.target.value)}
                    placeholder="Johndoe@mail.com"
                    className={clsx('form-input', {
                      'border-app-dark-border': theme.type === 'dark',
                    })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="username">
                    Username
                  </label>
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    placeholder="johndoe"
                    autoComplete="username"
                    className={clsx('form-input', {
                      'border-app-dark-border': theme.type === 'dark',
                    })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="password">
                    Password
                  </label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    className={clsx('form-input', {
                      'border-app-dark-border': theme.type === 'dark',
                    })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label
                    className="text-sm font-medium"
                    htmlFor="confirmPassword">
                    Confirm Password
                  </label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="new-password"
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
                  {isSubmitting ? 'Creating account...' : 'Sign up'}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex justify-center">
              <div className="text-center">
                <p className="text-sm text-app-gray">
                  Already have an account?{' '}
                  <Link href="/login" className="text-app hover:underline">
                    Sign in
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
