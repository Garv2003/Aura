import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { MasonryFlashList } from "@shopify/flash-list";
import { wp, getColumnCount, getImageSize } from "@/helpers/common";
import { Image } from "expo-image";
import { theme } from "@/constants/theme";
import { router } from "expo-router";

const ImageGrid = ({ images, router }: any) => {
  const columns = getColumnCount();

  return (
    <View style={styles.ImageGrid}>
      <MasonryFlashList
        data={images}
        numColumns={columns}
        estimatedItemSize={200}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item, index }) => (
          <ImageCard
            item={item}
            index={index}
            columns={columns}
            router={router}
          />
        )}
      />
    </View>
  );
};

const ImageCard = ({ item, index, columns, router }: any) => {
  const isLastInRow = () => {
    return (index + 1) % columns === 0;
  };

  const getImageHeight = () => {
    let { imageHeight: height, imageWidth: width } = item;
    return { height: getImageSize(height, width) };
  };

  return (
    <Pressable
      style={[styles.imageContainer, !isLastInRow() && styles.spacing]}
      key={index}
      onPress={() =>
        router.push({ pathname: "home/image", params: { ...item } })
      }
    >
      <Image
        source={{ uri: item?.webformatURL }}
        style={[styles.image, getImageHeight()]}
        contentFit="cover"
        transition={1000}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  ImageGrid: {
    minHeight: 3,
    width: wp(100),
  },
  listContainer: {
    paddingHorizontal: wp(4),
  },
  imageContainer: {
    backgroundColor: theme.colors.grayBG,
    borderRadius: theme.radius.xl,
    borderCurve: "continuous",
    overflow: "hidden",
    marginBottom: wp(2),
  },
  image: {
    width: "100%",
    height: 300,
    borderRadius: 10,
  },
  spacing: {
    marginRight: wp(2),
  },
});

export default ImageGrid;
