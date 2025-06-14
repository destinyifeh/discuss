'use client';

import {useState} from 'react';

import {PageHeader} from '@/components/app-headers';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {Button} from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {Input} from '@/components/ui/input';
import {ScrollArea} from '@/components/ui/scroll-area';
import {Textarea} from '@/components/ui/textarea';
import {zodResolver} from '@hookform/resolvers/zod';
import {useRouter} from 'next/navigation';
import {useForm} from 'react-hook-form';
import {toast} from 'sonner';
import * as z from 'zod';

const profileSchema = z.object({
  displayName: z.string().min(2, {
    message: 'Display name must be at least 2 characters.',
  }),
  bio: z.string().max(160, {
    message: 'Bio must not be longer than 160 characters.',
  }),
  location: z.string().max(30, {
    message: 'Location must not be longer than 30 characters.',
  }),
  website: z
    .string()
    .url({message: 'Please enter a valid URL.'})
    .or(z.literal('')),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export const EditProfilePage = () => {
  const [user] = useState({
    displayName: 'john doe',
    username: 'johnny',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
  });
  const navigate = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: user?.displayName || '',
      bio: '',
      location: '',
      website: '',
    },
  });

  const onSubmit = (data: ProfileFormValues) => {
    setIsSubmitting(true);
    // In a real app, you would send the data to the server
    setTimeout(() => {
      toast.success('Profile updated successfully!');
      setIsSubmitting(false);
      navigate.push(`/profile/${user?.username}`);
    }, 1000);
  };

  if (!user) return null;

  return (
    <div>
      <PageHeader title={'Edit Profile'} />

      <ScrollArea className="h-[calc(100vh-60px)]">
        <div className="p-4">
          <div className="mb-6 relative">
            {/* Cover photo */}
            <div className="h-32 rounded-lg mb-16 bg-app/20"></div>

            {/* Avatar */}
            <div className="absolute left-4 bottom-0 transform translate-y-1/2">
              <Avatar className="h-20 w-20 border-4 border-app-border">
                <AvatarImage src={user.avatar} />
                <AvatarFallback>{user.displayName.charAt(0)}</AvatarFallback>
              </Avatar>
            </div>

            {/* Upload buttons */}
            <div className="absolute right-4 bottom-4 flex gap-2">
              <Button variant="outline" size="sm" className="border-app-border">
                Change cover
              </Button>
              <Button variant="outline" size="sm" className="border-app-border">
                Change avatar
              </Button>
            </div>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 mt-8">
              <FormField
                control={form.control}
                name="displayName"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Display name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Your name"
                        {...field}
                        className="form-input"
                      />
                    </FormControl>
                    <FormDescription>
                      This is your public display name.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bio"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us about yourself"
                        className="resize-none form-input"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      {field.value?.length || 0}/160 characters
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Where you're based"
                        {...field}
                        className="form-input"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="website"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Website</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Your website URL"
                        {...field}
                        className="form-input"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-2 pb-8">
                <Button
                  type="button"
                  variant="outline"
                  className="border-app-border"
                  onClick={() => navigate.push(`/profile/${user.username}`)}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="border-app-border bg-app text-white hover:bg-app/90"
                  disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Save changes'}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </ScrollArea>
    </div>
  );
};
