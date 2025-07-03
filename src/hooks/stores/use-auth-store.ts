// stores/useAuthStore.ts
import {logoutRequestAction} from '@/modules/auth/actions';
import {toast} from 'sonner';
import {create} from 'zustand';
import {persist} from 'zustand/middleware';

type User2 = {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  following: string[];
  followers: string[];
  verified: boolean;
};

type AuthState = {
  currentUser: any;
  isLoading: boolean;

  setUser: (data: any) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  hasHydrated: boolean;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      isLoading: false,
      isAuthenticated: false,
      hasHydrated: false,

      setUser: async (data: any) => {
        console.log(data, 'currentUser data');
        set({currentUser: data, isAuthenticated: true});
      },

      logout: () => {
        set({currentUser: null, isAuthenticated: false});
        logoutRequestAction();
        toast.info('You have been logged out');
      },
    }),
    {
      name: 'current_user', // key in localStorage
      //storage: createJSONStorage(() => localStorage),
      partialize: state => ({
        currentUser: state.currentUser,
        isAuthenticated: state.isAuthenticated,
      }), // persist only what’s necessary

      onRehydrateStorage: () => state => {
        if (state) {
          state.hasHydrated = true; // ← or set(() => ({ hasHydrated: true }))
        }
      },
    },
  ),
);
