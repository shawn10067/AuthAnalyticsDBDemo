import {ActionButton} from '@/components/Button';
import {useFirstTimeOpen} from '@/hooks/useFirstTimeOpen';
import {useAuthStore} from '@/store/authStore';
import {useRouter} from 'expo-router';
import {ActivityIndicator, Alert, Button, Image, Text, View} from 'react-native';
import {BarcodeScanningResult, CameraView} from 'expo-camera';
import * as WebBrowser from 'expo-web-browser';
import {useRef, useState} from 'react';
import {CameraTools} from '@/components/CameraTools';
import {supabase} from '@/utils/supabase';
import * as FileSystem from 'expo-file-system';

const HomeScreen = () => {
  const router = useRouter();
  const user = useAuthStore(state => state.user);
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

  // define a function to get all the files from a folder from s3 using the user's id
  const getFiles = async () => {
    const userId = user?.id;

    if (!userId) {
      return;
    }

    const {data, error} = await supabase.storage.from('user-token-images').list(userId);

    if (error) {
      console.error('Error getting files:', error);
      return;
    }

    console.log('Files:', data);

    const signedUrls = await Promise.all(
      data.map(async file => {
        const {name} = file;
        const {data, error: signedUrlError} = await supabase.storage
          .from('user-token-images')
          .createSignedUrl(name, 60);

        if (signedUrlError) {
          console.error('Error creating signed URL:', signedUrlError);
          return;
        }

        return data?.signedUrl;
      })
    );

    console.log('Signed URLs:', signedUrls);
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
      const fileName = `public/${Date.now()}.jpg`;

      const userId = user?.id;

      if (!userId) {
        return;
      }

      // Check if there is a folder for the user, if not create one
      const {data: folderData, error: folderError} = await supabase.storage
        .from('user-token-images')
        .list(userId);

      if (folderError) {
        console.error('Error checking folder:', folderError);
        return;
      }

      if (folderData.length === 0) {
        console.log('Creating folder for user:', userId);
        const {error: createFolderError} = await supabase.storage.from('user-token-images').upload(
          `public/${userId}/.emptyFolderPlaceholder`,
          new Blob(
            [
              JSON.stringify({
                userId,
                email: user?.email || '',
              }),
            ],
            {type: 'text/plain'}
          )
        );

        if (createFolderError) {
          console.error('Error creating folder:', createFolderError);
          return;
        }
      }

      const {error} = await supabase.storage
        .from('user-token-images')
        .upload(`public/${userId}/${fileName}`, arrayBuffer, {contentType: 'image/jpeg'});
      if (error) {
        console.error('Error uploading image: ', error);
      }

      // const windows = await supabase.storage
      //   .from('user-token-images')
      //   .download(`wallpapers/og_windows.jpg`);
      // console.log('Windows:', windows);
    }
  };

  const renderCameraView = () => {
    if (photo) {
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
