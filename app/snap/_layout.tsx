import { Stack } from "expo-router";

export default function DefaultLayout() {
  return (
    <Stack
      screenOptions={{
        headerTintColor: "orange",
        headerStyle: {
          backgroundColor: "#020617",
        },
      }}
    >
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="onboarding"
        options={{
          headerShown: false,
          headerTitle: "Snap",
        }}
      />
    </Stack>
  );
}
