import { theme } from "@/constants/theme";
import { capitalize } from "@/helpers/common";
import React from "react";
import { Text, View, StyleSheet, Pressable } from "react-native";

const CommonFilterRow = ({ data, filters, setFilters, filterName }: any) => {
  const onSelect = (item: string) => {
    setFilters({ ...filters, [filterName]: item });
  };

  return (
    <View style={styles.flexRowWrap}>
      {data &&
        data.map((item: string, index: number) => {
          let isSelected = filters[filterName] === item;
          let backgroundColor = isSelected
            ? theme.colors.neutral(0.7)
            : "white";
          let color = isSelected ? "white" : theme.colors.neutral(0.7);
          return (
            <Pressable
              key={index}
              onPress={() => onSelect(item)}
              style={[styles.outlinedButton, { backgroundColor }]}
            >
              <Text style={[styles.outlinedButtonText, { color }]}>
                {capitalize(item)}
              </Text>
            </Pressable>
          );
        })}
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "gray",
  },
  flexRowWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  outlinedButton: {
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "gray",
  },
  outlinedButtonText: {
    color: "gray",
  },
});

export default CommonFilterRow;
