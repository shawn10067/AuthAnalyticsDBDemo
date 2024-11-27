import { ActivityIndicator, Alert, Text, View } from "react-native";
import { useCameraPermissions, useMicrophonePermissions } from "expo-camera";
import { usePermissions } from "expo-media-library";
import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { ActionButton } from "~/components/Button";
import { useFirstTimeOpen } from "~/hooks/useFirstTimeOpen";

const OnboardingScreen = () => {
  const router = useRouter();
  const { loading } = useFirstTimeOpen();

  // permissions
  const [_, requestCameraPermission] = useCameraPermissions();
  const [__, requestMicrophonePermission] = useMicrophonePermissions();
  const [___, requestMediaLibraryPermission] = usePermissions();

  const handleRequestPermissions = async (): Promise<boolean> => {
    const cameraStatus = await requestCameraPermission();
    if (!cameraStatus.granted) {
      Alert.alert("Camera permission required");
      return false;
    }

    const micStatus = await requestMicrophonePermission();
    if (!micStatus.granted) {
      Alert.alert("Microphone permission required");
      return false;
    }

    const mediaStatus = await requestMediaLibraryPermission();
    if (!mediaStatus.granted) {
      Alert.alert("Media permissions required");
      return false;
    }

    await AsyncStorage.setItem("hasOpened", "true");

    return true;
  };

  const handleContinue = async () => {
    const granted = await handleRequestPermissions();
    if (granted) {
      router.replace("/snap");
    } else {
      Alert.alert("To continue please go to your permissions in settings.");
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-800">
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View className="flex flex-1 items-center justify-center bg-slate-800">
      <View className="mb-2 w-full basis-1/5 items-center justify-end">
        <SymbolView
          size={92}
          name="camera.circle"
          tintColor="lightblue"
          type="hierarchical"
          animationSpec={{
            effect: {
              type: "pulse",
              direction: "up",
            },
            repeating: true,
          }}
        />
      </View>
      <View className="flex w-full basis-4/6 flex-col items-start justify-start gap-y-12 p-8">
        <Text className="text-3xl font-bold text-slate-200">
          Welcome to Momentz
        </Text>
        <View>
          <Text className="text-2xl text-slate-50">Camera permissions 📸</Text>
          <Text className="text-base font-light text-slate-50">
            For taking pictures
          </Text>
        </View>
        <View>
          <Text className="text-2xl text-slate-50">Audio permissions 🎙️</Text>
          <Text className="text-base font-light text-slate-50">
            For recording audio
          </Text>
        </View>
        <View>
          <Text className="text-2xl text-slate-50">
            Media library permissions 📚
          </Text>
          <Text className="text-base font-light text-slate-50">
            For saving media
          </Text>
        </View>
      </View>
      <View className="flex w-full basis-1/5 items-center justify-start">
        <ActionButton text="Continue" onPress={handleContinue} />
      </View>
    </View>
  );
};

export default OnboardingScreen;
