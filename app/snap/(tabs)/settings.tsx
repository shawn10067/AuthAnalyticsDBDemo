import { useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { useRouter } from "expo-router";

import { ActionButton } from "~/components/Button";
import { useAuthStore } from "~/store/authStore";

const SettingsScreen = () => {
  const [signingOut, setSigningOut] = useState(false);
  const router = useRouter();
  const logOut = useAuthStore((state) => state.logOut);

  return (
    <View className="flex-1 items-center justify-center bg-slate-700">
      <Text className="text-center text-xl text-slate-300">Boo! 👻</Text>
      {signingOut ? (
        <ActivityIndicator />
      ) : (
        <ActionButton
          text="Sign out"
          onPress={async () => {
            setSigningOut(true);
            await logOut();
            router.navigate("/");
            setSigningOut(false);
          }}
        />
      )}
    </View>
  );
};

export default SettingsScreen;
