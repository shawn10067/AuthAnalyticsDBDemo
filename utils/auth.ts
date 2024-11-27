import {AppleAuthenticationScope, signInAsync} from 'expo-apple-authentication';
import * as QueryParams from 'expo-auth-session/build/QueryParams';
import * as WebBrowser from 'expo-web-browser';

import type {UserProfile} from '~/store/profileStore';
import {supabase} from '~/utils/supabase';

// import minifaker from 'minifaker';

export const createSessionFromUrl = async (url: string) => {
  const {params, errorCode} = QueryParams.getQueryParams(url);

  if (errorCode) throw new Error(errorCode);
  const {access_token, refresh_token} = params;

  if (!access_token) return;

  const {data, error} = await supabase.auth.setSession({
    access_token,
    refresh_token: refresh_token ?? '',
  });
  if (error) throw error;
  return data.session;
};

export const addNewProfile = async (email: string) => {
  const {data, error} = await supabase
    .from('profiles')
    .insert([{email, name: 'sheen'}])
    .single();

  if (error) {
    console.error('Error creating profile:', error);
  }
  return data;
};

export interface ProfileResponse {
  data: UserProfile | null;
  error: Error | null;
}

export const fetchProfile = async (id: string): Promise<ProfileResponse> => {
  try {
    const {
      data,
      error,
    }: {
      data: UserProfile | null;
      error: Error | null;
    } = await supabase.from('profiles').select('*').eq('id', id).single();
    return {data, error};
  } catch (error) {
    console.error('Error fetching profile:', error);
  }

  return {data: null, error: null};
};

export const performOAuthGoogle = async (redirectTo: string) => {
  try {
    const {data, error} = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
        skipBrowserRedirect: true,
      },
    });

    if (error) throw error;

    const res = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);

    if (res.type === 'success') {
      const {url} = res;
      const session = await createSessionFromUrl(url);

      if (session) {
        const {error: profileError} = await fetchProfile(session.user.id);
        if (profileError && session.user.email) {
          await addNewProfile(session.user.email);
          console.log('created new profile for', session.user.email);
        }
        if (profileError) {
          console.error('No user when creating profile', profileError);
        }
      }
    }
  } catch (error) {
    console.error('Error signing in with Google:', error);
  }
};

export const performOauthApple = async () => {
  try {
    const credential = await signInAsync({
      requestedScopes: [AppleAuthenticationScope.FULL_NAME, AppleAuthenticationScope.EMAIL],
    });
    if (credential.identityToken) {
      const {data: appleData} = await supabase.auth.signInWithIdToken({
        provider: 'apple',
        token: credential.identityToken,
      });
      const data = appleData.session;
      const {data: profileData, error: profileError} = await fetchProfile(data?.user.id ?? '');
      if (profileError && data?.user.email) {
        await addNewProfile(data.user.email);
        console.log('Created new profile');
      }

      console.log('Found profile:', profileData, data?.user.id);
    } else {
      throw new Error('No identityToken.');
    }
  } catch (error) {
    console.error('Error signing in with Apple:', error);
  }
};
