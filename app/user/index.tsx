import {useAuthStore} from '@/store/authStore';
import {useRouter} from 'expo-router';
import {useState} from 'react';
import {ActivityIndicator, Button, Text, View} from 'react-native';

const WelcomeScreen = () => {
  const router = useRouter();
  const user = useAuthStore(state => state.user);
  const logOut = useAuthStore(state => state.logOut);
  const [signingOut, setSigningOut] = useState(false);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Text>Welcome, {user?.email}!</Text>
      {signingOut ? (
        <ActivityIndicator />
      ) : (
        <Button
          title="Log out"
          onPress={async () => {
            setSigningOut(true);
            await logOut();
            router.navigate('/');
            setSigningOut(false);
          }}
        />
      )}
    </View>
  );
};

export default WelcomeScreen;
