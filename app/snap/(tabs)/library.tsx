import React, { useEffect } from "react";
import { ActivityIndicator, Image, StyleSheet, Text, View } from "react-native";
import { FlashList } from "@shopify/flash-list";

import { useProfileStore } from "~/store/profileStore";

const LibraryScreen = () => {
  const { fetchPictures, pictures } = useProfileStore();

  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    void (async () => {
      setLoading(true);
      await fetchPictures();
      setLoading(false);
    })();
  }, [fetchPictures]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
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
    <View className="my-16 h-screen w-screen px-8">
      <FlashList
        data={pictures}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Image
            source={{ uri: item }}
            style={{ width: "100%", height: 400 }}
          />
        )}
        estimatedItemSize={100}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
  },
});

export default LibraryScreen;
