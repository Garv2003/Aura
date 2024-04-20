import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { useMemo } from "react";
import { BlurView } from "expo-blur";
import Animated, {
  interpolate,
  useAnimatedStyle,
  Extrapolation,
  FadeInDown,
} from "react-native-reanimated";
import { capitalize, hp } from "@/helpers/common";
import { theme } from "@/constants/theme";
import { filters as data } from "@/constants/data";
import SectionView from "./SectionView";
import CommonFilterRow from "./CommonFilterRow";
import ColorFilter from "./ColorFilter";

const FiltersModal = ({
  modalRef,
  onClose,
  setFilters,
  filters,
  applyFilters,
  resetFilters,
}: any) => {
  const snapPoints = useMemo(() => ["75%"], []);

  return (
    <BottomSheetModal
      ref={modalRef}
      index={0}
      snapPoints={snapPoints}
      enablePanDownToClose={true}
      backdropComponent={CustomBackdrop}
    >
      <BottomSheetView style={styles.contentContainer}>
        <View style={styles.content}>
          <Text style={styles.filterText}>Filters</Text>
          <Text style={styles.filterText}>Section here</Text>
          {Object.keys(sections).map((sectionName: string, index: number) => {
            const sectionView = sections[sectionName];
            let title = capitalize(sectionName);
            let sectionData = data[sectionName];
            return (
              <Animated.View
                key={sectionName}
                entering={FadeInDown.delay(index * 100)
                  .springify()
                  .damping(5)}
              >
                <SectionView
                  title={title}
                  content={sectionView({
                    data: sectionData,
                    filters,
                    setFilters,
                    filterName: sectionName,
                  })}
                />
              </Animated.View>
            );
          })}

          <Animated.View
            style={styles.buttons}
            entering={FadeInDown.delay(sections.length * 100)
              .springify()
              .damping(8)}
          >
            <Pressable
              style={{
                ...styles.button,
                backgroundColor: theme.colors.neutral(0.4),
              }}
              onPress={applyFilters}
            >
              <Text style={styles.buttonText}>Apply</Text>
            </Pressable>
            <Pressable
              style={{
                ...styles.button,
                backgroundColor: theme.colors.neutral(0.8),
              }}
              onPress={resetFilters}
            >
              <Text style={styles.buttonText}>Reset</Text>
            </Pressable>
          </Animated.View>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
};

const sections = {
  order: (props: any) => <CommonFilterRow {...props} />,
  orientation: (props: any) => <CommonFilterRow {...props} />,
  colors: (props: any) => <ColorFilter {...props} />,
  type: (props: any) => <CommonFilterRow {...props} />,
};

const CustomBackdrop = ({ animatedIndex, style }: any) => {
  const containerAnimatedStyle = useAnimatedStyle(() => {
    let opacity = interpolate(
      animatedIndex.value,
      [-1, 0],
      [0, 1],
      Extrapolation.CLAMP
    );
    return { opacity };
  });

  const containerStyle = [
    StyleSheet.absoluteFillObject,
    style,
    styles.overlay,
    containerAnimatedStyle,
  ];
  return (
    <Animated.View style={containerStyle}>
      <BlurView intensity={25} style={StyleSheet.absoluteFill} tint="dark" />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "#eaeaea",
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
  },
  overlay: {
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  content: {
    flex: 1,
    backgroundColor: "white",
    width: "100%",
    gap: 15,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  filterText: {
    fontSize: hp(4),
    fontWeight: "700",
    color: theme.colors.neutral(0.8),
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    width: "48%",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
});

export default FiltersModal;
