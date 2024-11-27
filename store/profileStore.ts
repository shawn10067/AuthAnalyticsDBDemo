import {create} from 'zustand';

import {fetchProfile} from '~/utils/auth';
import {supabase} from '~/utils/supabase';
import {useAuthStore} from './authStore';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
}

export interface ProfileStore {
  profile: UserProfile | null;
  pictures: string[];
  setProfile: (profile: UserProfile) => void;
  clearProfile: () => void;
  fetchPictures: () => Promise<void>;
}

export const useProfileStore = create<ProfileStore>(set => ({
  profile: null,
  pictures: [],
  setProfile: profile => set({profile}),
  clearProfile: () => set({profile: null, pictures: []}),
  fetchPictures: async () => {
    const {data, error} = await supabase.storage
      .from('user-token-images')
      .list(useAuthStore.getState().user?.id ?? '');

    if (error) {
      console.error('Error getting pictures:', error);
      return;
    }
    const signedUrls = await Promise.all(
      data.map(async (file: {name: string}) => {
        const filePath = `${useAuthStore.getState().user?.id}/${file.name}`;
        const {data: urlData, error: signedUrlError} = await supabase.storage
          .from('user-token-images')
          .createSignedUrl(filePath, 60);

        if (signedUrlError) {
          console.error('Error creating signed URL:', signedUrlError);
          return null;
        }

        return urlData.signedUrl;
      })
    );

    set({pictures: signedUrls.filter(Boolean) as string[]});
  },
}));

useAuthStore.subscribe((newAuthStore, prevAuthStore) => {
  void (async () => {
    if (newAuthStore.user === null && prevAuthStore.user !== null) {
      useProfileStore.getState().clearProfile();
    } else {
      const {data, error} = await fetchProfile(newAuthStore.user?.id ?? '');
      if (error) {
        console.error('Error fetching profile:', error);
      }

      if (data) {
        useProfileStore.getState().setProfile(data);
      }
    }
  })();
});
