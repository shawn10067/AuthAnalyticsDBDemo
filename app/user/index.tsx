import {ActionButton} from '@/components/Button';
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
    <View className="bg-slate-800 flex-1 justify-center items-center p-12">
      <Text className="text-orange-300 text-center m-4 mb-8 text-2xl">Welcome, {user?.email}</Text>
      <ActionButton
        text="Go to snap 👻"
        onPress={async () => {
          router.push('/snap');
        }}
      />
      {signingOut ? (
        <ActivityIndicator />
      ) : (
        <ActionButton
          text="Sign out"
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
