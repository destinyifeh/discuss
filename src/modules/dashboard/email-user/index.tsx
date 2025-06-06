'use client';

import {useState} from 'react';

import {PageHeader} from '@/components/app-headers';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';
import {useGlobalStore} from '@/hooks/stores/use-global-store';
import clsx from 'clsx';
import {AlertTriangle, Send} from 'lucide-react';
import {useParams, useRouter} from 'next/navigation';
import {toast} from 'sonner';

export const EmailMessage = () => {
  const {user} = useParams<{user: string}>();
  const [username] = useState('deee');
  const navigate = useRouter();
  const {theme} = useGlobalStore(state => state);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  console.log(user, 'my userr');
  if (!user) return null;

  // Find the recipient user (using our mock data, in real app would fetch from backend)
  const recipientUser = [
    {
      id: '1',
      username: 'johndoe',
      displayName: 'John Doe',
      email: 'john.doe@example.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    },
    {
      id: '2',
      username: 'janedoe',
      displayName: 'Jane Doe',
      email: 'jane.doe@example.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
    },
    {
      id: '3',
      username: 'theresatekenah',
      displayName: 'Theresa Tekenah',
      email: 'theresa.tekenah@example.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Theresa',
    },
  ].find(u => u.username === user);

  if (!recipientUser) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold mb-2">User not found</h2>
        <Button variant="outline" onClick={() => navigate.push('/home')}>
          Back to Home
        </Button>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!subject.trim()) {
      toast.error('Subject cannot be empty');
      return;
    }

    if (!message.trim()) {
      toast.error('Message cannot be empty');
      return;
    }

    setIsSending(true);

    // Simulate sending email
    setTimeout(() => {
      toast.success(`Email sent to ${recipientUser.displayName}`);
      setIsSending(false);
      navigate.push(`/profile/${recipientUser.username}`);
    }, 1500);
  };

  return (
    <div>
      <PageHeader title={`Email ${recipientUser.displayName}`} />

      <div className="p-4">
        <div
          className={clsx('rounded-lg border p-4', {
            'border-app-dark-border bg-app-dark': theme.type === 'dark',
            'border-app-border bg-white': theme.type === 'default',
          })}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="to"
                className="block text-sm font-medium text-gray-700 mb-1">
                To:
              </label>
              <Input
                id="to"
                value={`${recipientUser.displayName} <${recipientUser.email}>`}
                disabled
                className={clsx('form-input', {
                  'border-app-dark-border': theme.type === 'dark',
                })}
              />
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6 flex items-start">
              <AlertTriangle className="h-5 w-5 text-yellow-500 mr-3 mt-0.5" />
              <div>
                <h3 className="font-medium text-yellow-700">Privacy Notice</h3>
                <p className="text-sm text-yellow-600">
                  Messages sent through this system are private and will only be
                  visible to you and the recipient. Please remember our
                  community guidelines still apply to private messages.
                </p>
              </div>
            </div>

            <div>
              <label
                htmlFor="subject"
                className="block text-sm font-medium text-gray-700 mb-1">
                Subject:
              </label>
              <Input
                className={clsx('form-input', {
                  'border-app-dark-border': theme.type === 'dark',
                })}
                id="subject"
                placeholder="Enter subject"
                value={subject}
                onChange={e => setSubject(e.target.value)}
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700 mb-1">
                Message:
              </label>
              <Textarea
                id="message"
                placeholder="Type your message here..."
                value={message}
                onChange={e => setMessage(e.target.value)}
                className={clsx('min-h-[200px] resize-none form-input', {
                  'border-app-dark-border': theme.type === 'dark',
                })}
              />
            </div>

            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                className="bg-app hover:bg-app/90"
                disabled={isSending || !subject.trim() || !message.trim()}>
                {isSending ? (
                  'Sending...'
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Send Email
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
