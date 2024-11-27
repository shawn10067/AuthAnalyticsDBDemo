import { View } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";

export const CameraTools = ({
  cameraFacing,
  torchEnabled,
  flashMode,
  setCameraFacing,
  setTorchEnabled,
  setFlashMode,
}: {
  cameraFacing: "front" | "back";
  torchEnabled: boolean;
  flashMode: "on" | "off";
  setCameraFacing: React.Dispatch<React.SetStateAction<"front" | "back">>;
  setTorchEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  setFlashMode: React.Dispatch<React.SetStateAction<"on" | "off">>;
}) => {
  return (
    <View className="flex flex-1 flex-row items-end justify-evenly">
      {/* @ts-expect-error: Expo types are weird */}
      <FontAwesome.Button
        name="camera"
        onPress={() =>
          setCameraFacing(cameraFacing === "back" ? "front" : "back")
        }
        className="w-18 justify-center bg-slate-600"
      />
      {/* @ts-expect-error: Expo types are weird */}
      <FontAwesome.Button
        name="flash"
        onPress={() => setFlashMode(flashMode === "off" ? "on" : "off")}
        className="w-18 justify-center bg-slate-600"
      />
      {/* @ts-expect-error: Expo types are weird */}
      <FontAwesome.Button
        name="lightbulb-o"
        onPress={() => setTorchEnabled(!torchEnabled)}
        className="w-18 justify-center bg-slate-600"
      />
    </View>
  );
};
