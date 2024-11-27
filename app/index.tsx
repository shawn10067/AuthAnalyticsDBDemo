import {useCallback, useEffect, useState} from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';
import {
  AppleAuthenticationButton,
  AppleAuthenticationButtonStyle,
  AppleAuthenticationButtonType,
} from 'expo-apple-authentication';
import {makeRedirectUri} from 'expo-auth-session';
import {SplashScreen, useRouter} from 'expo-router';
import {StatusBar} from 'expo-status-bar';

import {useAuthStore} from '~/store/authStore';
// import { useProfileStore } from "~/store/profileStore";
import {performOauthApple, performOAuthGoogle} from '~/utils/auth';
import {supabase} from '~/utils/supabase';

const redirectTo = makeRedirectUri();

void SplashScreen.preventAutoHideAsync();

export default function App() {
  const user = useAuthStore(state => state.user);
  const logIn = useAuthStore(state => state.logIn);
  const [appIsReady, setAppIsReady] = useState(false);

  const router = useRouter();

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        logIn(session.user);
        router.replace('/snap');
      }
    });
  }, []);

  useEffect(() => {
    void (async () => {
      setAppIsReady(false);
      const user = await supabase.auth.getUser();
      if (user.data.user) {
        logIn(user.data.user);
      }
      setAppIsReady(true);
    })();
  }, [logIn]);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
      if (user) {
        router.replace('/snap');
      }
    }
  }, [appIsReady, router, user]);

  if (!appIsReady) {
    return null;
  }

  return (
    <View style={styles.container} onLayout={onLayoutRootView}>
      <Text>Let's get to working on the core</Text>
      <Button title="Login with google" onPress={() => performOAuthGoogle(redirectTo)} />
      <AppleAuthenticationButton
        buttonType={AppleAuthenticationButtonType.SIGN_IN}
        buttonStyle={AppleAuthenticationButtonStyle.BLACK}
        cornerRadius={5}
        style={{width: 200, height: 64}}
        onPress={performOauthApple}
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
