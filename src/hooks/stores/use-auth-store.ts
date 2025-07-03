// stores/useAuthStore.ts
import {logoutRequestAction} from '@/modules/auth/actions';
import {UserProps} from '@/types/user.types';
import {toast} from 'sonner';
import {create} from 'zustand';
import {persist} from 'zustand/middleware';

type AuthState = {
  currentUser: UserProps | null;
  isLoading: boolean;

  setUser: (data: any) => Promise<void>;
  logout: () => void;
  sessionExpiredAction: () => void;
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
      },
      sessionExpiredAction: () => {
        set({currentUser: null, isAuthenticated: false});
        toast.info('Session expired. Please log in again');
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
