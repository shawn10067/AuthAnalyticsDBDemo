import {useAuthStore} from '@/store/authStore';
import {useRouter} from 'expo-router';
import {useState} from 'react';
import {ActivityIndicator, Button, View, Text, Pressable} from 'react-native';

const WelcomeScreen = () => {
  const [signingOut, setSigningOut] = useState(false);
  const router = useRouter();
  const user = useAuthStore(state => state.user);
  const logOut = useAuthStore(state => state.logOut);

  return (
    <View className="bg-slate-800 flex-1 justify-center items-center p-12">
      <Text className="text-orange-300 text-center m-4 mb-8 text-2xl">Welcome, {user?.email}</Text>
      <Pressable
        className="h-12 items-center justify-center p-4 bg-slate-600 rounded-md active:bg-blue-400 w-48 m-4"
        onPress={async () => {
          router.push('/snap');
        }}
      >
        <Text className="text-orange-300">Go to snap 👻</Text>
      </Pressable>
      {signingOut ? (
        <ActivityIndicator />
      ) : (
        <Pressable
          className="h-12 items-center justify-center p-4 bg-slate-600 rounded-md active:bg-blue-400 w-48 m-4"
          onPress={async () => {
            setSigningOut(true);
            await logOut();
            router.navigate('/');
            setSigningOut(false);
          }}
        >
          <Text className="text-orange-300">Sign out</Text>
        </Pressable>
      )}
    </View>
  );
};

export default WelcomeScreen;
