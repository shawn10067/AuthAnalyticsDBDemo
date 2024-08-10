import {useAuthStore} from '@/store/authStore';
import {useRouter} from 'expo-router';
import {useState} from 'react';
import {ActivityIndicator, Button, View, Text} from 'react-native';

const WelcomeScreen = () => {
  const [signingOut, setSigningOut] = useState(false);
  const router = useRouter();
  const user = useAuthStore(state => state.user);
  const logOut = useAuthStore(state => state.logOut);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Text className="text-orange-300 text-2xl">Welcome, {user?.email}!</Text>
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
      <Button title="Go to snap!" onPress={() => router.navigate('/snap')} />
    </View>
  );
};

export default WelcomeScreen;
