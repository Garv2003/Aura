import React from "react";
import { Text, View, Pressable } from "react-native";
import { theme } from "@/constants/theme";
import { capitalize } from "@/helpers/common";
import { pad } from "lodash";

const ColorFilter = ({ data, filters, setFilters, filterName }: any) => {
  const onSelect = (item: string) => {
    setFilters({ ...filters, [filterName]: item });
  };

  return (
    <View style={{ ...styles.flexRowWrap, flexDirection: "row" }}>
      {data &&
        data.map((item: string, index: number) => {
          let isSelected = filters[filterName] === item;
          let borderColor = isSelected ? theme.colors.neutral(0.4) : "white";

          return (
            <Pressable key={index} onPress={() => onSelect(item)}>
              <View style={[styles.colorWrapper, { borderColor }]}>
                <View
                  style={[
                    styles.color,
                    {
                      backgroundColor: item,
                    },
                    {
                      borderColor: isSelected
                        ? theme.colors.neutral(0)
                        : "black",
                    },
                  ]}
                />
              </View>
            </Pressable>
          );
        })}
    </View>
  );
};

const styles = {
  flexRowWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  colorWrapper: {
    width: 35,
    height: 30,
    borderRadius: theme.radius.sm - 3,
    borderCurve: "continuous",
  },
  color: {
    width: "100%",
    height: "100%",
    padding: 3,
    borderRadius: theme.radius.sm,
    borderWidth: 3,
    margin: 2,
    borderCurve: "continuous",
  },
};

export default ColorFilter;
