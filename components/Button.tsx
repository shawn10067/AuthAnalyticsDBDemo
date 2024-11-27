import type { PressableProps } from "react-native";
import { Pressable, Text } from "react-native";

export const ActionButton = ({
  text,
  onPress,
}: {
  text: string;
  onPress: PressableProps["onPress"];
}) => {
  return (
    <Pressable
      className="m-4 h-12 w-48 items-center justify-center rounded-md bg-slate-600 p-4 active:bg-blue-400"
      onPress={onPress}
    >
      <Text className="text-orange-300">{text}</Text>
    </Pressable>
  );
};
