import {useAuthStore} from '@/store/authStore';
import {useRouter} from 'expo-router';
import {useState} from 'react';
import {ActivityIndicator, Button, Pressable, Text, View} from 'react-native';

const SnapScreen = () => {
  const router = useRouter();
  const user = useAuthStore(state => state.user);

  return (
    <View className="bg-slate-800 flex-1 justify-center items-center">
      <Text className="text-lg text-emerald-300 text-center">
        Welcome to the Snap Screen {user?.email}!
      </Text>
      <Pressable
        className="h-12 items-center justify-center p-4 bg-slate-600 rounded-md active:bg-blue-400 w-48 m-4"
        onPress={async () => {
          router.back();
        }}
      >
        <Text className="text-orange-300">Go back</Text>
      </Pressable>
      <Pressable
        className="h-12 items-center justify-center p-4 bg-slate-600 rounded-md active:bg-blue-400 w-48 m-4"
        onPress={async () => {
          router.push('/snap/preview');
        }}
      >
        <Text className="text-orange-300">Go to preview 📸</Text>
      </Pressable>
    </View>
  );
};

export default SnapScreen;
