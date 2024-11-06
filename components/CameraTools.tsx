import FontAwesome from '@expo/vector-icons/FontAwesome';
import {View} from 'react-native';

export const CameraTools = ({
  cameraFacing,
  torchEnabled,
  flashMode,
  setCameraFacing,
  setTorchEnabled,
  setFlashMode,
}: {
  cameraFacing: 'front' | 'back';
  torchEnabled: boolean;
  flashMode: 'on' | 'off';
  setCameraFacing: React.Dispatch<React.SetStateAction<'front' | 'back'>>;
  setTorchEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  setFlashMode: React.Dispatch<React.SetStateAction<'on' | 'off'>>;
}) => {
  return (
    <View className="flex-1 justify-evenly flex flex-row items-end">
      <FontAwesome.Button
        name="camera"
        onPress={() => setCameraFacing(cameraFacing === 'back' ? 'front' : 'back')}
        className="bg-slate-600 w-18 justify-center"
      />
      <FontAwesome.Button
        name="flash"
        onPress={() => setFlashMode(flashMode === 'off' ? 'on' : 'off')}
        className="bg-slate-600 w-18 justify-center"
      />
      <FontAwesome.Button
        name="lightbulb-o"
        onPress={() => setTorchEnabled(!torchEnabled)}
        className="bg-slate-600 w-18 justify-center"
      />
    </View>
  );
};
