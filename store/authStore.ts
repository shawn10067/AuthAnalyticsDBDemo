import {create} from 'zustand';
import {User} from '@supabase/supabase-js';
import mixpanel from '@/utils/mixpanel';
import {supabase} from '@/utils/supabase';

type AuthStore = {
  user: User | null;
  logIn: (user: User) => void;
  logOut: () => void;
};

export const useAuthStore = create<AuthStore>(set => ({
  user: null,
  logIn: async (user: User) => {
    mixpanel.identify(user.id ?? '');
    mixpanel.registerSuperProperties({
      email: user.email ?? '',
    });

    set({user: user});
  },
  logOut: async () => {
    await supabase.auth.signOut();
    mixpanel.reset();
    set({user: null});
  },
}));
