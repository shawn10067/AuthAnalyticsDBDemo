import {useAuthStore} from '@/store/authStore';
import {supabase} from '@/utils/supabase';
import {OAuthResponse, User} from '@supabase/supabase-js';
import * as QueryParams from 'expo-auth-session/build/QueryParams';
import {StatusBar} from 'expo-status-bar';
import * as WebBrowser from 'expo-web-browser';
import {SetStateAction, useCallback, useEffect, useState} from 'react';
import * as Linking from 'expo-linking';
import {makeRedirectUri} from 'expo-auth-session';

import {Button, StyleSheet, Text, View} from 'react-native';
import {
  AppleAuthenticationButton,
  AppleAuthenticationButtonStyle,
  AppleAuthenticationButtonType,
  AppleAuthenticationScope,
  signInAsync,
} from 'expo-apple-authentication';
import {SplashScreen} from 'expo-router';
import mixpanel from '@/utils/mixpanel';

const redirectTo = makeRedirectUri();

const createSessionFromUrl = async (url: string) => {
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

const performOAuthGoogle = async () => {
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
        // Fetch user profile from Supabase DB
        const {data: profileData, error: profileError} = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        console.log('Found profile:', profileData, session.user.id);

        if (profileError) {
          // If profile doesn't exist, create one
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

        // Set user state in your app
        // setUser({
        // email: session.user.email,
        // });
      }
    } else {
      console.log('OAuth login failed');
    }
  } catch (error) {
    console.error('Error signing in with Google:', error);
  }
};

const performOauthApple = async () => {
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

      // Fetch user profile from Supabase DB
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

      // Set user state in your app
      // setUser({
      //   email: data.user.email,
      // });
    } else {
      throw new Error('No identityToken.');
    }
  } catch (error) {
    if (error.code === 'ERR_REQUEST_CANCELED') {
      console.error('Apple Sign In Request Canceled');
    } else {
      console.error('Error signing in with Apple:', error);
    }
  }
};

SplashScreen.preventAutoHideAsync();

export default function App() {
  const user = useAuthStore(state => state.user);
  const setUser = useAuthStore(state => state.setUser);
  const [appIsReady, setAppIsReady] = useState(false);

  // listen for auth state changes
  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        mixpanel.identify(session?.user.id ?? '');
        mixpanel.registerSuperProperties({
          email: session?.user.email ?? '',
        });
        setUser({
          email: session?.user.email ?? '',
        });
      } else if (event === 'SIGNED_OUT') {
        mixpanel.reset();
        setUser(null);
      }
    });
  }, []);

  // if we already have a session, set the user
  useEffect(() => {
    (async () => {
      setAppIsReady(false);
      const user = await supabase.auth.getUser();
      if (user.data.user) {
        mixpanel.identify(user.data.user.id);
        mixpanel.registerSuperProperties({
          email: user.data.user.email,
        });
        setUser({
          email: user.data.user?.email ?? '',
        });
      }
      setAppIsReady(true);
    })();
  }, []);

  // for email magic link
  const url = Linking.useURL();
  if (url) createSessionFromUrl(url);

  // hide splash screen
  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }
  return (
    <View style={styles.container} onLayout={onLayoutRootView}>
      <Text>Let's get to working on the core</Text>
      <Button title="Login with google" onPress={performOAuthGoogle} />
      <AppleAuthenticationButton
        buttonType={AppleAuthenticationButtonType.SIGN_IN}
        buttonStyle={AppleAuthenticationButtonStyle.BLACK}
        cornerRadius={5}
        style={{width: 200, height: 64}}
        onPress={performOauthApple}
      />
      <Button
        title={user ? `Logout of ${user.email}` : 'No user'}
        onPress={async () => {
          await supabase.auth.signOut();
          setUser(null);
        }}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
