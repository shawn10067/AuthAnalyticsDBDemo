import {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useFirstTimeOpen = () => {
  const [isFirstTime, setIsFirstTime] = useState(false);
  const [loading, setIsLoading] = useState(true);

  const clearFirstTime = async () => {
    try {
      await AsyncStorage.removeItem('hasOpened');
    } catch (error) {
      console.error('Error clearing first time open:', error);
    }
  };

  useEffect(() => {
    void (async () => {
      try {
        setIsLoading(true);
        const isFirstTimeOpen = await AsyncStorage.getItem('hasOpened');
        if (isFirstTimeOpen === null) {
          setIsFirstTime(true);
        } else {
          setIsFirstTime(false);
        }
      } catch (error) {
        console.error('Error checking if first time open:', error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  return {isFirstTime, loading, clearFirstTime};
};
