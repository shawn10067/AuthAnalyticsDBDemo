import {ActionButton} from '@/components/Button';
import {useFirstTimeOpen} from '@/hooks/useFirstTimeOpen';
import {useAuthStore} from '@/store/authStore';
import {useRouter} from 'expo-router';
import {ActivityIndicator, Alert, Button, Text, View} from 'react-native';
import {SymbolView} from 'expo-symbols';
import {usePermissions} from 'expo-media-library';
import {useCameraPermissions, useMicrophonePermissions} from 'expo-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OnboardingScreen = () => {
  const router = useRouter();
  const user = useAuthStore(state => state.user);
  const {isFirstTime, loading, clearFirstTime} = useFirstTimeOpen();

  // permissions
  const [cameraPermissionResult, requestCameraPermission] = useCameraPermissions();
  const [microphonePermissionResult, requestMicrophonePermission] = useMicrophonePermissions();
  const [mediaLibraryPermissionResult, requestMediaLibraryPermission] = usePermissions();

  const handleRequestPermissions = async (): Promise<boolean> => {
    const cameraStatus = await requestCameraPermission();
    if (!cameraStatus.granted) {
      Alert.alert('Camera permission required');
      return false;
    }

    const micStatus = await requestMicrophonePermission();
    if (!micStatus.granted) {
      Alert.alert('Microphone permission required');
      return false;
    }

    const mediaStatus = await requestMediaLibraryPermission();
    if (!mediaStatus.granted) {
      Alert.alert('Media permissions required');
      return false;
    }

    await AsyncStorage.setItem('hasOpened', 'true');

    return true;
  };

  const handleContinue = async () => {
    const granted = await handleRequestPermissions();
    if (granted) {
      router.replace('/snap');
    } else {
      Alert.alert('To continue please go to your permissions in settings.');
    }
  };

  if (loading) {
    return (
      <View className="bg-slate-800 flex-1 justify-center items-center">
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View className="bg-slate-800 flex-1 justify-center items-center flex">
      <View className="basis-1/5 justify-end mb-2 items-center w-full">
        <SymbolView
          size={92}
          name="camera.circle"
          tintColor="lightblue"
          type="hierarchical"
          animationSpec={{
            effect: {
              type: 'pulse',
              direction: 'up',
            },
            repeating: true,
          }}
        />
      </View>
      <View className="flex basis-4/6 justify-start items-start w-full flex-col gap-y-12 p-8">
        <Text className="text-3xl font-bold text-slate-200">Welcome to Momentz</Text>
        <View>
          <Text className="text-2xl text-slate-50">Camera permissions 📸</Text>
          <Text className="text-base font-light text-slate-50">For taking pictures</Text>
        </View>
        <View>
          <Text className="text-2xl text-slate-50">Audio permissions 🎙️</Text>
          <Text className="text-base font-light text-slate-50">For recording audio</Text>
        </View>
        <View>
          <Text className="text-2xl text-slate-50">Media library permissions 📚</Text>
          <Text className="text-base font-light text-slate-50">For saving media</Text>
        </View>
      </View>
      <View className="flex basis-1/5 justify-start items-center w-full">
        <ActionButton text="Continue" onPress={handleContinue} />
      </View>
    </View>
  );
};

export default OnboardingScreen;
