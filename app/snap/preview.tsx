import {useAuthStore} from '@/store/authStore';
import {useRouter} from 'expo-router';
import {Pressable, Text, View} from 'react-native';

const PreviewScreen = () => {
  const router = useRouter();

  return (
    <View className="bg-slate-700 flex-1 justify-center items-center">
      <Text className="text-xl text-slate-300 text-center">Boo! 👻</Text>
      <Pressable
        className="h-12 items-center justify-center p-4 bg-slate-600 rounded-md active:bg-blue-400 w-48 m-4"
        onPress={async () => {
          router.back();
        }}
      >
        <Text className="text-orange-300">Go back</Text>
      </Pressable>
    </View>
  );
};

export default PreviewScreen;
