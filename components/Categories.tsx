import React from "react";
import { View, Text, FlatList, StyleSheet, Pressable } from "react-native";
import { categories } from "@/constants/data";
import { hp, wp } from "@/helpers/common";
import { theme } from "@/constants/theme";
import Animated, { FadeInDown } from "react-native-reanimated";

const Categories = ({
  activeCategory,
  handleCategoryPress,
}: {
  activeCategory: string;
  handleCategoryPress: Function;
}) => {
  return (
    <FlatList
      data={categories}
      contentContainerStyle={styles.flatlistContainer}
      keyExtractor={(item) => item}
      horizontal
      showsHorizontalScrollIndicator={false}
      renderItem={({ item, index }) => (
        <CategoryItem
          title={item}
          index={index}
          isActive={activeCategory === item}
          handleCategoryPress={handleCategoryPress}
        />
      )}
    />
  );
};

const CategoryItem = ({
  title,
  index,
  isActive,
  handleCategoryPress,
}: {
  title: string;
  index: number;
  isActive: boolean;
  handleCategoryPress: Function;
}) => {
  let color = isActive ? theme.colors.white : theme.colors.neutral(0.8);
  let BackgroundColor = isActive
    ? theme.colors.neutral(0.8)
    : theme.colors.white;

  return (
    <Animated.View
      key={index}
      entering={FadeInDown.delay(index * 100)
        .springify()
        .damping(14)}
    >
      <Pressable
        style={[
          styles.category,
          {
            backgroundColor: BackgroundColor,
          },
        ]}
        onPress={() => handleCategoryPress(isActive ? "" : title)}
      >
        <Text style={[styles.title, { color }]}>{title}</Text>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  flatlistContainer: {
    paddingHorizontal: wp(4),
    gap: 8,
  },
  category: {
    padding: 12,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: theme.colors.grayBG,
    borderRadius: theme.radius.lg,
    borderCurve: "continuous",
  },
  title: {
    fontSize: hp(1.8),
    fontWeight: "500",
  },
});

export default Categories;
