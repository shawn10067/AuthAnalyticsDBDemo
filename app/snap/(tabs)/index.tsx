import {ActionButton} from '@/components/Button';
import {useFirstTimeOpen} from '@/hooks/useFirstTimeOpen';
import {useAuthStore} from '@/store/authStore';
import {useRouter} from 'expo-router';
import {ActivityIndicator, Alert, Button, Image, Text, View} from 'react-native';
import {BarcodeScanningResult, CameraView} from 'expo-camera';
import * as WebBrowser from 'expo-web-browser';
import {useRef, useState} from 'react';
import {CameraTools} from '@/components/CameraTools';

const HomeScreen = () => {
  const router = useRouter();
  const user = useAuthStore(state => state.user);
  const {clearFirstTime} = useFirstTimeOpen();
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [cameraFacing, setCameraFacing] = useState<'front' | 'back'>('back');
  const [torchEnabled, setTorchEnabled] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);
  const [flashMode, setFlashMode] = useState<'on' | 'off'>('off');

  const cameraRef = useRef<CameraView>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const handleQRCodeResult = (result: BarcodeScanningResult) => {
    clearTimeout(timeoutRef.current);
    if (qrCode) return;
    const {data} = result;
    console.log('QR Code:', data);
    timeoutRef.current = setTimeout(() => {
      setQrCode(null);
    }, 2000);
    if (data && !qrCode) {
      setQrCode(data);
    }
  };

  const handleTakePicture = async () => {
    const photo = await cameraRef.current?.takePictureAsync({
      quality: 0.5,
      exif: true,
    });
    if (photo) {
      console.log('Photo taken:', photo);
      console.log('Photo size:', photo.exif);
      setPhoto(photo.uri);
    }
  };

  const renderCameraView = () => {
    if (photo) {
      console.log('Photo', photo);
      return (
        <View className="flex-1 justify-center items-center flex">
          <Text className="text-white">Photo taken:</Text>
          <View className="w-96 h-96 rounded-3xl overflow-hidden">
            <Image source={{uri: photo}} className="w-full h-full" />
          </View>
          <ActionButton text="Retake" onPress={() => setPhoto(null)} />
        </View>
      );
    }

    return (
      <CameraView
        ref={cameraRef}
        className="w-96 h-96 rounded-3xl overflow-hidden"
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
        onBarcodeScanned={handleQRCodeResult}
        facing={cameraFacing}
        enableTorch={torchEnabled}
        flash={flashMode}
      >
        <CameraTools
          {...{
            cameraFacing,
            torchEnabled,
            flashMode,
            setCameraFacing,
            setTorchEnabled,
            setFlashMode,
          }}
        />
      </CameraView>
    );
  };

  return (
    <View className="bg-slate-800 flex-1 justify-center items-center flex">
      {renderCameraView()}
      <Text className="text-white">Welcome to the main feed</Text>
      <Text className="text-white">{user?.email}</Text>
      {qrCode && (
        <ActionButton
          text="QR Code detected ->"
          onPress={() => {
            WebBrowser.openBrowserAsync(qrCode, {
              presentationStyle: WebBrowser.WebBrowserPresentationStyle.FORM_SHEET,
            });
            setTimeout(() => {
              setQrCode(null);
            }, 1000);
          }}
        />
      )}
      <ActionButton text="Take Picture" onPress={handleTakePicture} />
    </View>
  );
};

export default HomeScreen;
