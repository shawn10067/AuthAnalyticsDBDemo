import type {BarcodeScanningResult} from 'expo-camera';
import {useRef, useState} from 'react';
import {Alert, Image, Text, View} from 'react-native';
import {CameraView} from 'expo-camera';
import * as WebBrowser from 'expo-web-browser';

import {ActionButton} from '~/components/Button';
import {CameraTools} from '~/components/CameraTools';
import {useAuthStore} from '~/store/authStore';
import {useProfileStore} from '~/store/profileStore';
import {supabase} from '~/utils/supabase';

const HomeScreen = () => {
  const user = useAuthStore(state => state.user);
  const fetchPictures = useProfileStore(state => state.fetchPictures);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [cameraFacing, setCameraFacing] = useState<'front' | 'back'>('back');
  const [torchEnabled, setTorchEnabled] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);
  const [flashMode, setFlashMode] = useState<'on' | 'off'>('off');

  const profileState = useProfileStore();

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
      setPhoto(photo.uri);

      const response = await fetch(photo.uri);
      const blob = await response.blob();
      const arrayBuffer = await new Response(blob).arrayBuffer();

      const userId = user?.id;
      if (!userId) {
        return;
      }

      const imageFileName = `${userId}/${Date.now()}.jpg`;

      try {
        const {error: uploadError} = await supabase.storage
          .from('user-token-images')
          .upload(imageFileName, arrayBuffer, {
            contentType: 'image/jpeg',
            upsert: false,
          });

        if (uploadError) {
          console.error('Error uploading image:', uploadError);
          Alert.alert('Upload Error', 'Failed to upload image. Please try again.');
          return;
        }

        console.log('Image uploaded successfully');
      } catch (error) {
        console.error('Error in upload process:', error);
        Alert.alert('Error', 'An unexpected error occurred. Please try again.');
      }
    }

    void fetchPictures();
  };

  const renderCameraView = () => {
    if (photo) {
      return (
        <View className="flex flex-1 items-center justify-center">
          <Text className="text-white">Photo taken:</Text>
          <View className="h-96 w-96 overflow-hidden rounded-3xl">
            <Image source={{uri: photo}} className="h-full w-full" />
          </View>
          <ActionButton text="Retake" onPress={() => setPhoto(null)} />
        </View>
      );
    }

    return (
      <CameraView
        ref={cameraRef}
        className="h-96 w-96 overflow-hidden rounded-3xl"
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
    <View className="flex flex-1 items-center justify-center bg-slate-800">
      {renderCameraView()}
      <Text className="text-white">Welcome to the main feed</Text>
      <Text className="text-white">{user?.email}</Text>
      {qrCode && (
        <ActionButton
          text="QR Code detected ->"
          onPress={() => {
            void WebBrowser.openBrowserAsync(qrCode, {
              presentationStyle: WebBrowser.WebBrowserPresentationStyle.FORM_SHEET,
            });
            setTimeout(() => {
              setQrCode(null);
            }, 1000);
          }}
        />
      )}
      <ActionButton text="Take Picture" onPress={handleTakePicture} />
      <ActionButton
        text="Log current profile"
        onPress={() => {
          console.log(profileState.profile);
        }}
      />
    </View>
  );
};

export default HomeScreen;
