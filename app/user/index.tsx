import { useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { useRouter } from "expo-router";

import { ActionButton } from "~/components/Button";
import { useAuthStore } from "~/store/authStore";

const WelcomeScreen = () => {
  const [signingOut, setSigningOut] = useState(false);
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const logOut = useAuthStore((state) => state.logOut);

  return (
    <View className="flex-1 items-center justify-center bg-slate-800 p-12">
      <Text className="m-4 mb-8 text-center text-2xl text-orange-300">
        Welcome, {user?.email}
      </Text>
      <ActionButton
        text="Go to snap 👻"
        onPress={() => {
          router.push("/snap");
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
            router.navigate("/");
            setSigningOut(false);
          }}
        />
      )}
    </View>
  );
};

export default WelcomeScreen;
