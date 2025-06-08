'use client';

import {PageHeader} from '@/components/app-headers';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {useGlobalStore} from '@/hooks/stores/use-global-store';
import clsx from 'clsx';
import {Eye, Heart, MessageCircle, Shield, Star, Users} from 'lucide-react';
import Link from 'next/link';

export const CommunityGuidelines = () => {
  const {theme} = useGlobalStore(state => state);
  const guidelines = [
    {
      icon: Heart,
      title: 'Be respectful and inclusive',
      description:
        'Treat others with respect. Harassment, hate speech, and discrimination will not be tolerated.',
      color: 'text-red-500',
    },
    {
      icon: MessageCircle,
      title: 'Stay on topic',
      description:
        'Keep comments relevant to the post topic to maintain productive conversations.',
      color: 'text-blue-500',
    },
    {
      icon: Shield,
      title: 'No spam or self-promotion',
      description:
        "Don't post promotional content unless it's relevant and adds value to the discussion.",
      color: 'text-green-500',
    },
    {
      icon: Eye,
      title: 'Protect privacy',
      description: "Don't share personal information about yourself or others.",
      color: 'text-purple-500',
    },
    {
      icon: Star,
      title: 'Quality contributions',
      description:
        'Make an effort to contribute meaningfully to discussions with well-thought-out comments.',
      color: 'text-yellow-500',
    },
  ];

  return (
    <div className="">
      <PageHeader title="Communnity Guidelines" />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Users className="mx-auto mb-6 h-16 w-16 text-app" />
            <h1 className="text-4xl font-bold mb-6">Community Guidelines</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Be respectful and kind to others. Keep discussions constructive.
            </p>
          </div>

          <div className="space-y-6 mb-12">
            {guidelines.map((guideline, index) => {
              const IconComponent = guideline.icon;
              return (
                <Card
                  key={index}
                  className={clsx({
                    'text-app-dark-text bg-app-dark-bg/10 border-app-dark-border hover:bg-app-dark-bg/10':
                      theme.type === 'dark',
                    'hover:shadow-lg transition-shadow':
                      theme.type === 'default',
                  })}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <IconComponent className={`h-6 w-6 ${guideline.color}`} />
                      {guideline.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed">
                      {guideline.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Card
            className={clsx({
              'text-white bg-app/90 border-app-dark-border hover:bg-app':
                theme.type === 'dark',
              'bg-app text-white': theme.type === 'default',
            })}>
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">
                Help Us Build a Better Community
              </h2>
              <p className="mb-6 opacity-90">
                If you see content that violates these guidelines, please report
                it to help us maintain a safe and welcoming environment for
                everyone.
              </p>
              <div className="space-x-4">
                <Link href="/report-abuse">
                  <Button variant="secondary">Report Content</Button>
                </Link>
                <Link href="/contact-support">
                  <Button
                    variant="outline"
                    className="text-app border-white hover:bg-white hover:text-app">
                    Get Help
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};
