'use client';

import {Button} from '@/components/ui/button';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {useGlobalStore} from '@/hooks/stores/use-global-store';
import clsx from 'clsx';
import {Globe, Heart, Target, Users} from 'lucide-react';
import Link from 'next/link';

export const AboutPage = () => {
  const {theme} = useGlobalStore(state => state);
  return (
    <div>
      <div className="">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1
              className={clsx('text-4xl font-bold mb-4', {
                'text-app-dark-text': theme.type === 'dark',
                'text-gray-900': theme.type === 'default',
              })}>
              About Discussday
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Building the future of online discussions with meaningful
              conversations and authentic connections.
            </p>
          </div>

          {/* Mission Section */}
          <Card
            className={clsx('mb-8', {
              'text-app-dark-text bg-app-dark-bg/10 border-app-dark-border hover:bg-app-dark-bg/10':
                theme.type === 'dark',
            })}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-6 w-6 text-[#0A66C2]" />
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                At Discussday, we believe in the power of meaningful
                conversations to bring people together, share knowledge, and
                build communities. Our platform is designed to foster respectful
                dialogue, encourage diverse perspectives, and create a space
                where everyone's voice matters.
              </p>
            </CardContent>
          </Card>

          {/* Values Section */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <Card
              className={clsx({
                'text-app-dark-text bg-app-dark-bg/10 border-app-dark-border hover:bg-app-dark-bg/10':
                  theme.type === 'dark',
              })}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-[#0A66C2]" />
                  Community First
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  We prioritize building strong, supportive communities where
                  members feel valued and heard.
                </p>
              </CardContent>
            </Card>

            <Card
              className={clsx({
                'text-app-dark-text bg-app-dark-bg/10 border-app-dark-border hover:bg-app-dark-bg/10':
                  theme.type === 'dark',
              })}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-[#0A66C2]" />
                  Respect & Inclusion
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  We foster an environment of mutual respect where diverse
                  perspectives are welcomed and celebrated.
                </p>
              </CardContent>
            </Card>

            <Card
              className={clsx({
                'text-app-dark-text bg-app-dark-bg/10 border-app-dark-border hover:bg-app-dark-bg/10':
                  theme.type === 'dark',
              })}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-[#0A66C2]" />
                  Global Reach
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Connecting people from around the world to share knowledge and
                  experiences across cultures.
                </p>
              </CardContent>
            </Card>

            <Card
              className={clsx({
                'text-app-dark-text bg-app-dark-bg/10 border-app-dark-border hover:bg-app-dark-bg/10':
                  theme.type === 'dark',
              })}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-[#0A66C2]" />
                  Quality Content
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Promoting high-quality discussions and content that adds value
                  to our community.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Team Section */}
          <Card
            className={clsx('mb-8', {
              'text-app-dark-text bg-app-dark-bg/10 border-app-dark-border hover:bg-app-dark-bg/10':
                theme.type === 'dark',
            })}>
            <CardHeader>
              <CardTitle>Our Team</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-6">
                Discuss is built by a passionate team of developers, designers,
                and community managers who are committed to creating the best
                possible experience for our users.
              </p>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-3"></div>
                  <h3 className="font-semibold">Sarah Johnson</h3>
                  <p className="text-sm text-gray-600">CEO & Founder</p>
                </div>
                <div className="text-center">
                  <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-3"></div>
                  <h3 className="font-semibold">Mike Chen</h3>
                  <p className="text-sm text-gray-600">CTO</p>
                </div>
                <div className="text-center">
                  <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-3"></div>
                  <h3 className="font-semibold">Emily Rodriguez</h3>
                  <p className="text-sm text-gray-600">Head of Community</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Section */}
          <Card
            className={clsx({
              'text-app-dark-text bg-app-dark-bg/10 border-app-dark-border hover:bg-app-dark-bg/10':
                theme.type === 'dark',
            })}>
            <CardHeader>
              <CardTitle>Get in Touch</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                Have questions or want to learn more about Discussday? We'd love
                to hear from you.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button
                  asChild
                  className={clsx('text-white', {
                    'bg-app hover:bg-app/90': theme.type === 'default',
                    'bg-app/90 hover:bg-app': theme.type === 'dark',
                  })}>
                  <Link href="/help-center">Ask a Question</Link>
                </Button>
                {/* <Button variant="outline" asChild>
                  <Link href="/careers">Join Our Team</Link>
                </Button> */}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
