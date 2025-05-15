// stores/useAuthStore.ts
import {toast} from 'sonner';
import {create} from 'zustand';
import {persist} from 'zustand/middleware';

type User = {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  following: string[];
  followers: string[];
  verified: boolean;
};

type AuthState = {
  user: User | null;
  isLoading: boolean;
  register: (
    username: string,
    password: string,
    displayName: string,
  ) => Promise<void>;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  loginWithGoogle: () => Promise<void>;
};

// Mock users for demo
const mockUsers: User[] = [
  {
    id: '1',
    username: 'johndoe',
    displayName: 'John Doe',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    following: ['2', '3'],
    followers: ['2'],
    verified: true,
  },
  {
    id: '2',
    username: 'janedoe',
    displayName: 'Jane Doe',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
    following: ['1'],
    followers: ['1', '3'],
    verified: false,
  },
  {
    id: '3',
    username: 'theresatekenah',
    displayName: 'Theresa Tekenah',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Theresa',
    following: ['2'],
    followers: ['1'],
    verified: true,
  },
];

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      isAuthenticated: false,

      register: async (username, password, displayName) => {
        set({isLoading: true});

        const exists = mockUsers.some(user => user.username === username);
        if (exists) {
          set({isLoading: false});
          toast.error('Username already exists');
          throw new Error('Username already exists');
        }

        const newUser: User = {
          id: (mockUsers.length + 1).toString(),
          username,
          displayName,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
          following: [],
          followers: [],
          verified: false,
        };

        mockUsers.push(newUser);
        set({user: newUser, isAuthenticated: true});
        toast.success('Registration successful!');
        set({isLoading: false});
      },

      login: async (username, password) => {
        set({isLoading: true});
        const foundUser = mockUsers.find(user => user.username === username);

        if (!foundUser) {
          toast.error('Invalid username or password');
          set({isLoading: false});
          throw new Error('Invalid username or password');
        }

        set({user: foundUser, isAuthenticated: true});
        toast.success('Login successful!');
        set({isLoading: false});
      },

      loginWithGoogle: async () => {
        set({isLoading: true});

        try {
          // In a real app, you would implement actual Google OAuth flow
          // For demo purposes, we'll create a mock Google user
          const googleUser: User = {
            id: (mockUsers.length + 1).toString(),
            username: `google_user_${Date.now().toString().slice(-5)}`,
            displayName: 'Google User',
            avatar:
              'https://api.dicebear.com/7.x/avataaars/svg?seed=GoogleUser',
            following: [],
            followers: [],
            verified: true,
          };

          // Check if a user with similar credentials exists
          const existingUser = mockUsers.find(user =>
            user.username.startsWith('google_user_'),
          );

          if (existingUser) {
            // If user exists, log them in
            set({user: existingUser, isAuthenticated: true});
            // localStorage.setItem('forum_user', JSON.stringify(existingUser));
            toast.success('Login with Google successful!');
          } else {
            // If no user exists, create a new one
            mockUsers.push(googleUser);
            set({user: googleUser, isAuthenticated: true});
            //localStorage.setItem('forum_user', JSON.stringify(googleUser));
            toast.success('Registration with Google successful!');
          }
        } catch (error) {
          console.error('Google authentication failed:', error);
          toast.error('Google authentication failed. Please try again.');
          throw error;
          //throw new Error('Invalid username or password');
        } finally {
          set({isLoading: false});
        }
      },

      logout: () => {
        set({user: null, isAuthenticated: false});
        toast.info('You have been logged out');
      },
    }),
    {
      name: 'forum_user', // key in localStorage
      partialize: state => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }), // persist only what’s necessary
    },
  ),
);
