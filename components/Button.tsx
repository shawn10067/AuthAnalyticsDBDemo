import {Pressable, PressableProps, Text} from 'react-native';

export const ActionButton = ({
  text,
  onPress,
}: {
  text: string;
  onPress: PressableProps['onPress'];
}) => {
  return (
    <Pressable
      className="h-12 items-center justify-center p-4 bg-slate-600 rounded-md active:bg-blue-400 w-48 m-4"
      onPress={onPress}
    >
      <Text className="text-orange-300">{text}</Text>
    </Pressable>
  );
};
