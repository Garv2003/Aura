import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from "react-native";
import React, { useCallback, useEffect } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather, FontAwesome6, Ionicons } from "@expo/vector-icons";
import { theme } from "@/constants/theme";
import { hp, wp } from "@/helpers/common";
import Categories from "@/components/Categories";
import { apiCall } from "@/api";
import ImageGrid from "@/components/ImageGrid";
import { debounce } from "lodash";
import FiltersModal from "@/components/FiltersModal";
import { capitalize } from "@/helpers/common";
import { useRouter } from "expo-router";
var page = 1;

const Home = () => {
  const { top } = useSafeAreaInsets();
  const paddingTop = top > 0 ? top + 10 : 30;
  const [search, setSearch] = React.useState("");
  const [images, setImages] = React.useState<any>([]);
  const [activeCategory, setActiveCategory] = React.useState<string>("");
  const [filters, setFilters] = React.useState<any>({});
  const searchInput = React.useRef(null);
  const modalRef = React.useRef(null);
  const scrollRef = React.useRef(null);
  const router = useRouter();

  const handleCategoryPress = (cat: string) => {
    setActiveCategory(cat);
    clearSearch();
    setImages([]);
    page = 1;
    if (cat) {
      const params = { page: 1, category: cat };
      fetchImages(params);
    }
  };

  useEffect(() => {
    fetchImages();
  }, [activeCategory]);

  const fetchImages = async (
    params = {
      page: page,
    },
    append = false
  ) => {
    let res = await apiCall(params);
    if (res.success && res?.data?.hits) {
      setImages(append ? [...images, ...res.data.hits] : res.data.hits);
    }
  };

  const handleSearch = (text: string) => {
    setSearch(text);
    if (text.length > 0) {
      page = 1;
      setImages([]);
      setActiveCategory("");
      const params = { page: page, q: text, ...filters };
      fetchImages(params);
    }
    if (text.length === 0) {
      page = 1;
      setImages([]);
      const params = { page: page, ...filters };
      fetchImages(params);
    }
  };

  const handleTextChange = useCallback(debounce(handleSearch, 500), []);

  const clearSearch = () => {
    (searchInput?.current as any)?.clear();
    setSearch("");
    handleSearch("");
  };

  const openFiltersModal = () => {
    if (modalRef?.current) {
      (modalRef.current as any).present();
    }
  };

  const closeFiltersModal = () => {
    if (modalRef?.current) {
      (modalRef.current as any).close();
    }
  };

  const applyFilters = () => {
    page = 1;
    setImages([]);
    let params = { page: page, ...filters };
    if (activeCategory) {
      params = { page: page, category: activeCategory, ...filters };
    }
    if (search) {
      params = { page: page, q: search, ...filters };
    }
    fetchImages(params);
    closeFiltersModal();
  };

  const resetFilters = () => {
    setFilters({});
    page = 1;
    setImages([]);
    let params = { page: page };
    if (activeCategory) {
      params = { page: page, category: activeCategory };
    }
    if (search) {
      params = { page: page, q: search };
    }
    fetchImages(params);
    closeFiltersModal();
  };

  const clearFilters = (filter: string) => {
    let newFilters = { ...filters };
    delete newFilters[filter];
    setFilters(newFilters);
    page = 1;
    setImages([]);
    let params = { page: page, ...newFilters };
    if (activeCategory) {
      params = { page: page, category: activeCategory, ...newFilters };
    }
    if (search) {
      params = { page: page, q: search, ...newFilters };
    }
    fetchImages(params);
  };

  const handleScroll = (event: any) => {
    let contentHeight = event.nativeEvent.contentSize.height;
    let offset = event.nativeEvent.contentOffset.y;
    let layoutHeight = event.nativeEvent.layoutMeasurement.height;
    if (contentHeight - offset < layoutHeight + 20) {
      page = page + 1;
      let params = { page: page, ...filters };
      if (activeCategory) {
        params = { page: page, category: activeCategory, ...filters };
      }
      if (search) {
        params = { page: page, q: search, ...filters };
      }
      fetchImages(params, true);
    }
  };

  const handleScrollUp = () => {
    if (scrollRef.current) {
      (scrollRef.current as ScrollView).scrollTo({
        x: 0,
        y: 0,
        animated: true,
      });
    }
  };

  return (
    <View style={[styles.container, { paddingTop: paddingTop }]}>
      <View style={styles.header}>
        <Pressable onPress={handleScrollUp}>
          <Text style={styles.title}>Aura</Text>
        </Pressable>
        <Pressable onPress={() => openFiltersModal()}>
          <FontAwesome6
            name="bars-staggered"
            size={24}
            color={theme.colors.neutral(0.7)}
          />
        </Pressable>
      </View>
      <ScrollView
        contentContainerStyle={{ gap: 15 }}
        onScroll={handleScroll}
        scrollEventThrottle={5}
        ref={scrollRef}
      >
        <View style={styles.searchBar}>
          <View style={styles.searchIcon}>
            <Feather
              name="search"
              size={24}
              color={theme.colors.neutral(0.4)}
            />
          </View>
          <TextInput
            placeholder="Search for photos..."
            style={styles.searchInput}
            ref={searchInput}
            onChangeText={handleTextChange}
          />
          {search && (
            <Pressable onPress={clearSearch} style={styles.closeIcon}>
              <Ionicons
                name="close"
                size={24}
                color={theme.colors.neutral(0.6)}
              />
            </Pressable>
          )}
        </View>

        <View style={styles.categories}>
          <Categories
            activeCategory={activeCategory}
            handleCategoryPress={handleCategoryPress}
          />
        </View>
        {filters && (
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filters}
          >
            {Object.keys(filters).map((filter: string, index: number) => {
              return (
                <View key={filter} style={styles.filter}>
                  <Text style={styles.filterText}>
                    {capitalize(filter)}: {filters[filter]}
                  </Text>
                  <Pressable
                    onPress={() => {
                      clearFilters(filter);
                    }}
                  >
                    <Ionicons
                      name="close"
                      size={16}
                      color={theme.colors.neutral(0.6)}
                    />
                  </Pressable>
                </View>
              );
            })}
          </ScrollView>
        )}
        <View>
          {images.length > 0 && <ImageGrid images={images} router={router} />}
        </View>

        <View
          style={{
            marginBottom: 70,
            marginTop: images.length > 0 ? 0 : 70,
            alignItems: "center",
          }}
        >
          <ActivityIndicator size="large" color={theme.colors.neutral(0.5)} />
        </View>
      </ScrollView>
      <FiltersModal
        modalRef={modalRef}
        filters={filters}
        setFilters={setFilters}
        onClose={closeFiltersModal}
        applyFilters={applyFilters}
        resetFilters={resetFilters}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 15,
  },
  header: {
    marginHorizontal: wp(4),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: hp(3),
    fontWeight: "600",
    color: theme.colors.neutral(0.9),
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: wp(4),
    padding: 8,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.grayBG,
  },
  searchIcon: {
    padding: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: hp(2),
    color: theme.colors.neutral(0.9),
  },
  closeIcon: {
    backgroundColor: theme.colors.neutral(0.1),
    padding: 5,
    borderRadius: theme.radius.md,
  },
  categories: {},
  filters: {
    paddingHorizontal: 10,
    gap: 10,
  },
  filter: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.grayBG,
    padding: 8,
    borderRadius: theme.radius.sm,
    marginRight: 10,
  },
  filterText: {
    color: theme.colors.neutral(0.9),
    marginRight: 5,
  },
});

export default Home;
