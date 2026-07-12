# KampusMarket

MVP aplikasi marketplace jual-beli barang bekas mahasiswa, dibangun dengan
**React Native + Expo**. Data produk & simulasi login memakai API publik
[DummyJSON](https://dummyjson.com).

## Menjalankan proyek

```bash
npm install
npx expo start
```

Lalu scan QR code dengan aplikasi **Expo Go** (Android/iOS), atau tekan
`a` untuk membuka di emulator Android / `i` untuk simulator iOS / `w` untuk
web.

## Login

DummyJSON hanya menerima login dengan akun demo yang sudah ada di
database mereka (endpoint `/auth/login`). Gunakan salah satu akun berikut:

| Username | Password    |
| -------- | ----------- |
| emilys   | emilyspass  |
| michaelw | michaelwpass|

Halaman **Daftar Akun** tetap berfungsi penuh (validasi + memanggil
endpoint `POST /users/add`), tapi karena DummyJSON adalah fake REST API,
akun baru tidak benar-benar tersimpan untuk login — ini disebutkan
langsung di UI setelah pendaftaran berhasil.

## Struktur proyek

```
App.js                        # entry point, merangkai semua provider
src/
  constants/theme.js           # design tokens (warna, spacing, font)
  services/api.js              # semua pemanggilan DummyJSON
  context/
    AuthContext.js             # state login, persist ke AsyncStorage
    WishlistContext.js         # state wishlist/keranjang
  components/                  # komponen reusable
    Button.js
    InputField.js
    ProductCard.js
    CategoryFilter.js
    ApiState.js                 # status loading/error/empty yang konsisten
  screens/
    LoginScreen.js
    RegisterScreen.js
    HomeScreen.js               # katalog + search + filter kategori
    ProductDetailScreen.js
    WishlistScreen.js
    ProfileScreen.js
  navigation/
    AppNavigator.js             # root stack, gating login
    MainTabNavigator.js         # bottom tabs: Home, Wishlist, Profil
```

## Pemenuhan ketentuan wajib UAS

1. **Layout (Flexbox)** — 3 halaman utama (Login, Katalog, Detail Produk),
   grid produk menyesuaikan jumlah kolom berdasarkan lebar layar
   (`useWindowDimensions` di `HomeScreen.js` & `WishlistScreen.js`).
2. **Komponen** — 5 komponen reusable: `Button`, `InputField`,
   `ProductCard`, `CategoryFilter`, `ApiState`.
3. **Lists** — katalog & wishlist memakai `FlatList` dengan `numColumns`
   dinamis.
4. **State & Hooks** — pencarian di-debounce (400ms) dan filter kategori
   memanggil endpoint DummyJSON yang sesuai tanpa memblokir UI.
5. **Form** — Login & Daftar Akun memvalidasi kelengkapan nama, format
   email (regex), dan panjang password (≥ 6 karakter) sebelum submit.
6. **Navigasi** — bottom tab (Home, Wishlist, Profil); dari Home bisa
   masuk ke Detail Produk; `AppNavigator` memaksa user login dulu sebelum
   bisa mengakses tab utama.
7. **API** — semua pemanggilan data (produk, kategori, detail, login)
   menampilkan status **loading / berhasil / gagal** lewat komponen
   `ApiState`, lengkap dengan tombol "Coba Lagi" saat gagal.

## Catatan pengembangan lanjutan

MVP ini fokus pada ketujuh ketentuan wajib. Beberapa hal yang bisa
ditambahkan untuk pengembangan lebih lanjut: checkout/keranjang belanja
sungguhan, upload produk sendiri, pagination "load more" di katalog, dan
unit test untuk context/komponen.
