import { Pressable, Text, View, StyleSheet } from "react-native";
import { hp } from "@/helpers/common";
import { theme } from "@/constants/theme";

const SectionView = ({ title, content }: any) => {
  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View>{content}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: hp(2.5),
    fontWeight: "bold",
    color: theme.colors.neutral(0.8),
  },
});

export default SectionView;
