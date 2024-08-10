import {useAuthStore} from '@/store/authStore';
import {useRouter} from 'expo-router';
import {useState} from 'react';
import {ActivityIndicator, Button, Text, View} from 'react-native';

const SnapScreen = () => {
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
      <Text>Welcome to the Snap Screen, {user?.email}!</Text>
      <Button title="Go back" onPress={() => router.back()} />
    </View>
  );
};

export default SnapScreen;
