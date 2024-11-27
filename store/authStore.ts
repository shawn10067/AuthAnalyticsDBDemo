import type {AuthUser} from '@supabase/supabase-js';
import {create} from 'zustand';

import mixpanel from '~/utils/mixpanel';
import {supabase} from '~/utils/supabase';

interface AuthStore {
  user: AuthUser | null;
  logIn: (user: AuthUser) => void;
  logOut: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>(set => ({
  user: null,
  logIn: (user: AuthUser) => {
    void mixpanel.identify(user.id);
    void mixpanel.registerSuperProperties({
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
