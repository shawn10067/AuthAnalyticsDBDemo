import {supabase} from '@/utils/supabase';
import * as QueryParams from 'expo-auth-session/build/QueryParams';
import * as WebBrowser from 'expo-web-browser';
import {AppleAuthenticationScope, signInAsync} from 'expo-apple-authentication';

export const createSessionFromUrl = async (url: string) => {
  const {params, errorCode} = QueryParams.getQueryParams(url);

  if (errorCode) throw new Error(errorCode);
  const {access_token, refresh_token} = params;

  if (!access_token) return;

  const {data, error} = await supabase.auth.setSession({
    access_token,
    refresh_token,
  });
  if (error) throw error;
  return data.session;
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

    const res = await WebBrowser.openAuthSessionAsync(data?.url ?? '', redirectTo);

    if (res.type === 'success') {
      const {url} = res;
      const session = await createSessionFromUrl(url);

      if (session) {
        const {data: profileData, error: profileError} = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        console.log('Found profile:', profileData, session.user.id);

        if (profileError) {
          console.error('Error fetching profile:', profileError);
          const {data: newProfile, error: createError} = await supabase
            .from('profiles')
            .insert([{email: session.user.email}])
            .single();

          if (createError) {
            console.error('Error creating profile:', createError);
            throw createError;
          }

          console.log('Created new profile:', newProfile);
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
      const {error, data} = await supabase.auth.signInWithIdToken({
        provider: 'apple',
        token: credential.identityToken,
      });

      if (error) {
        throw error;
      }

      const {data: profileData, error: profileError} = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (profileError) {
        const {data: newProfile, error: createError} = await supabase
          .from('profiles')
          .insert([{email: data.user.email}])
          .single();

        if (createError) {
          throw createError;
        }

        console.log('Created new profile:', newProfile);
      }

      console.log('Found profile:', profileData, data.user.id);
    } else {
      throw new Error('No identityToken.');
    }
  } catch (error: any) {
    if (error.code === 'ERR_REQUEST_CANCELED') {
      console.error('Apple Sign In Request Canceled');
    } else {
      console.error('Error signing in with Apple:', error);
    }
  }
};
