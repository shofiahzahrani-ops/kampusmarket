import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { toRupiahAmount } from "../utils/currency";

const OrdersContext = createContext(null);
const STORAGE_KEY = "@kampusmarket_orders";

// Menyediakan alur "Beli Sekarang": membuat pesanan (order) dari sebuah
// produk + jumlah, menyimpannya secara lokal (AsyncStorage) supaya bisa
// dilihat lagi di halaman "Pesanan Saya", tanpa perlu backend pembayaran.
export function OrdersProvider({ children }) {
  const [orders, setOrders] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) setOrders(JSON.parse(raw));
      } catch (e) {
        // gagal baca cache order, mulai dari kosong
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  const persist = useCallback(async (next) => {
    setOrders(next);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch (e) {
      // gagal simpan, abaikan (tetap ada di state untuk sesi ini)
    }
  }, []);

  const checkout = useCallback(
    async ({ product, quantity = 1 }) => {
      const unitPriceIdr = toRupiahAmount(product.price);
      const order = {
        id: `ORD-${Date.now()}`,
        createdAt: new Date().toISOString(),
        productId: product.id,
        title: product.title,
        thumbnail: product.thumbnail,
        quantity,
        unitPriceIdr,
        totalIdr: unitPriceIdr * quantity,
        status: "Berhasil",
      };
      const next = [order, ...orders];
      await persist(next);
      return order;
    },
    [orders, persist]
  );

  const value = useMemo(
    () => ({ orders, loaded, checkout }),
    [orders, loaded, checkout]
  );

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>;
}

export function useOrders() {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error("useOrders must be used within OrdersProvider");
  return ctx;
}
