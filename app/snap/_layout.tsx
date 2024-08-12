import {Stack} from 'expo-router';
import SnapScreen from '.';

export default function DefaultLayout() {
  return (
    <Stack
      screenOptions={{
        headerTintColor: 'orange',
        headerStyle: {
          backgroundColor: '#020617',
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Snap',
        }}
      />
    </Stack>
  );
}
