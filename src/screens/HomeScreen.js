import React, { useEffect, useState, useCallback, useMemo, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  useWindowDimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { getProducts, getCategories, searchProducts, getProductsByCategory } from "../services/api";
import ProductCard from "../components/ProductCard";
import CategoryFilter from "../components/CategoryFilter";
import ApiState from "../components/ApiState";
import GradientBackground from "../components/GradientBackground";
import { useWishlist } from "../context/WishlistContext";
import { COLORS, SPACING, FONT, FONTS } from "../constants/theme";

const DEBOUNCE_MS = 400;

export default function HomeScreen({ navigation }) {
  const { width } = useWindowDimensions();
  // Layout Flexbox responsif: jumlah kolom menyesuaikan lebar layar
  // (ketentuan wajib no. 1).
  const numColumns = width >= 900 ? 4 : width >= 600 ? 3 : 2;

  const { toggleWishlist, isInWishlist } = useWishlist();

  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [status, setStatus] = useState("loading"); // loading | success | error | empty
  const [errorMessage, setErrorMessage] = useState("");

  const debounceRef = useRef(null);

  const loadCategories = useCallback(async () => {
    try {
      const data = await getCategories();
      // DummyJSON kadang mengembalikan array of string, kadang array of object
      const names = data.map((c) => (typeof c === "string" ? c : c.slug || c.name));
      setCategories(names);
    } catch (e) {
      // Kategori gagal dimuat bukan hal fatal, katalog tetap bisa tampil.
    }
  }, []);

  const loadProducts = useCallback(async ({ category = "all", query = "" } = {}) => {
    setStatus("loading");
    setErrorMessage("");
    try {
      let data;
      if (query.trim()) {
        data = await searchProducts(query.trim());
      } else if (category !== "all") {
        data = await getProductsByCategory(category);
      } else {
        data = await getProducts({ limit: 40 });
      }
      const products = data.products || [];
      setAllProducts(products);
      setStatus(products.length === 0 ? "empty" : "success");
    } catch (err) {
      setStatus("error");
      setErrorMessage(err.message);
    }
  }, []);

  useEffect(() => {
    loadCategories();
    loadProducts();
  }, [loadCategories, loadProducts]);

  // State & Hooks: pencarian di-debounce supaya tidak memanggil API
  // di setiap ketikan (ketentuan wajib no. 4 - tidak lemot/macet).
  function handleSearchChange(text) {
    setSearchText(text);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      loadProducts({ category: selectedCategory, query: text });
    }, DEBOUNCE_MS);
  }

  function handleSelectCategory(category) {
    setSelectedCategory(category);
    setSearchText("");
    loadProducts({ category });
  }

  const listData = useMemo(() => allProducts, [allProducts]);

  return (
    <GradientBackground>
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Katalog Produk</Text>
          <View style={styles.searchBar}>
            <Ionicons name="search-outline" size={18} color={COLORS.textMuted} />
            <TextInput
              value={searchText}
              onChangeText={handleSearchChange}
              placeholder="Cari barang bekas..."
              placeholderTextColor={COLORS.textFaint}
              style={styles.searchInput}
            />
          </View>
        </View>

        <CategoryFilter
          categories={categories}
          selected={selectedCategory}
          onSelect={handleSelectCategory}
        />

        {status === "loading" || status === "error" || status === "empty" ? (
          <ApiState
            status={status}
            errorMessage={errorMessage}
            onRetry={() => loadProducts({ category: selectedCategory, query: searchText })}
            emptyText="Produk tidak ditemukan. Coba kata kunci lain."
          />
        ) : (
          <FlatList
            data={listData}
            key={numColumns} // remount grid saat jumlah kolom berubah (rotasi layar)
            keyExtractor={(item) => String(item.id)}
            numColumns={numColumns}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <ProductCard
                product={item}
                onPress={() => navigation.navigate("ProductDetail", { productId: item.id })}
                onToggleWishlist={() => toggleWishlist(item)}
                isWishlisted={isInWishlist(item.id)}
              />
            )}
          />
        )}
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  header: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  headerTitle: {
    fontSize: FONT.title,
    fontFamily: FONTS.display,
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.glass,
    borderRadius: 16,
    paddingHorizontal: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
    gap: SPACING.xs,
  },
  searchInput: {
    flex: 1,
    paddingVertical: SPACING.sm + 2,
    fontSize: FONT.body,
    color: COLORS.text,
  },
  listContent: {
    padding: SPACING.xs,
    paddingBottom: 140,
  },
});
