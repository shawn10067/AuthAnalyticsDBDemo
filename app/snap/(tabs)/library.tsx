import {useProfileStore} from '@/store/profileStore';
import React, {useEffect} from 'react';
import {View, Text, StyleSheet, Image, Dimensions} from 'react-native';
import {FlashList} from '@shopify/flash-list';

const LibraryScreen = () => {
  const {getPictures, pictures} = useProfileStore();

  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      getPictures();
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Waiting...</Text>
      </View>
    );
  }

  if (pictures.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>No pictures found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlashList
        data={pictures}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => <Image source={{uri: item}} style={{width: '100%', height: 400}} />}
        estimatedItemSize={100}
        // horizontal={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    padding: 16,
    paddingTop: 32,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default LibraryScreen;
