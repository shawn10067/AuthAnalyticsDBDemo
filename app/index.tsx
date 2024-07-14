import {useAuthStore} from '@/store/authStore';
import {supabase} from '@/utils/supabase';
import {OAuthResponse} from '@supabase/supabase-js';
import * as QueryParams from 'expo-auth-session/build/QueryParams';
import {StatusBar} from 'expo-status-bar';
import * as WebBrowser from 'expo-web-browser';
import {useEffect} from 'react';
import * as Linking from 'expo-linking';
import {makeRedirectUri} from 'expo-auth-session';

import {Button, StyleSheet, Text, View} from 'react-native';

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

const performOAuth = async () => {
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
    await createSessionFromUrl(url);
  }
};

const sendMagicLink = async () => {
  const {error} = await supabase.auth.signInWithOtp({
    email: 'example@email.com',
    options: {
      emailRedirectTo: redirectTo,
    },
  });

  if (error) throw error;
  // Email sent.
};

export default function App() {
  const user = useAuthStore(state => state.user);
  const setUser = useAuthStore(state => state.setUser);
  // useEffect(() => {
  //   (async () => {
  //     const insert = await supabase.from('test').insert([{name: 'test'}]);
  //     const res = await supabase.from('test').select('name');
  //     console.log(res.data);
  //   })();
  // }, []);

  const url = Linking.useURL();
  if (url) createSessionFromUrl(url);

  return (
    <View style={styles.container}>
      <Text>Let's get to working on the core</Text>
      <Button
        title="Login with google"
        // onPress={async () => {
        //   // TODO: fix this cuz its wrong. follow link/video on notion
        //   console.log('hello');
        //   const signUpSession: OAuthResponse = await supabase.auth.signInWithOAuth({
        //     provider: 'google',
        //   });
        //   if (signUpSession.error) {
        //     console.log(signUpSession.error);
        //   } else {
        //     console.dir(signUpSession, {depth: null});
        //   }
        // }}
        onPress={performOAuth}
      />
      <Button title="Send magic link" onPress={sendMagicLink} />
      <Button
        title="logout"
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
