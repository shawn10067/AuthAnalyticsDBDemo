import {create} from 'zustand';
import {useAuthStore} from './authStore';
import {supabase} from '@/utils/supabase';
import {fetchProfile} from '@/utils/auth';

interface UserProfile {
  id: string;
  name: string;
  email: string;
}

interface ProfileStore {
  profile: UserProfile | null;
  setProfile: (profile: UserProfile) => void;
  clearProfile: () => void;
}

export const useProfileStore = create<ProfileStore>(set => ({
  profile: null,
  setProfile: profile => set({profile}),
  clearProfile: () => set({profile: null}),
}));

useAuthStore.subscribe(async (prevAuthStore, newAuthStore) => {
  if (newAuthStore.user === null) {
    useProfileStore.getState().clearProfile();
  } else {
    const {data, error} = await fetchProfile(newAuthStore.user.id);
    if (error) {
      console.error('Error fetching profile:', error);
    }

    if (data) {
      useProfileStore.getState().setProfile(data);
    }
  }
});
