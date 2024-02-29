import {useAuthStore} from '@/store/authStore';
import {supabase} from '@/utils/supabase';
import {OAuthResponse} from '@supabase/supabase-js';
import {StatusBar} from 'expo-status-bar';
import {useEffect} from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';

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
  return (
    <View style={styles.container}>
      <Text>Let's get to working on the core</Text>
      <Button
        title="Login with google"
        onPress={async () => {
          // TODO: fix this cuz its wrong. follow link/video on notion
          console.log('hello');
          const signUpSession: OAuthResponse = await supabase.auth.signInWithOAuth({
            provider: 'google',
          });
          if (signUpSession.error) {
            console.log(signUpSession.error);
          } else {
            console.dir(signUpSession, {depth: null});
          }
        }}
      />
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
