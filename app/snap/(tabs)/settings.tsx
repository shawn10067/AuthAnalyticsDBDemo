import {ActionButton} from '@/components/Button';
import {useAuthStore} from '@/store/authStore';
import {useRouter} from 'expo-router';
import {useState} from 'react';
import {ActivityIndicator, Text, View} from 'react-native';

const SettingsScreen = () => {
  const [signingOut, setSigningOut] = useState(false);
  const router = useRouter();
  const logOut = useAuthStore(state => state.logOut);

  return (
    <View className="bg-slate-700 flex-1 justify-center items-center">
      <Text className="text-xl text-slate-300 text-center">Boo! 👻</Text>
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

export default SettingsScreen;
