import { ActivityIndicator, View } from "react-native";
import { Redirect, Tabs } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";

import { useFirstTimeOpen } from "~/hooks/useFirstTimeOpen";

export default function TabLayout() {
  const { loading, isFirstTime } = useFirstTimeOpen();

  if (loading) {
    return (
      <View className="flex flex-1 items-center justify-center bg-slate-800">
        <ActivityIndicator />
      </View>
    );
  }

  if (isFirstTime) return <Redirect href={"/snap/onboarding"} />;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "lightblue",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          backgroundColor: "#020617",
          borderTopWidth: 0,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Snap",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="snapchat-ghost" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="library"
        options={{
          title: "Library",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="book" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="cog" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
