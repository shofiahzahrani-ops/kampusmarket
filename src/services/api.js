// Semua komunikasi ke API DummyJSON dikumpulkan di sini supaya
// screen/komponen tidak perlu tahu detail URL/fetch (poin Networking & API).

const BASE_URL = "https://dummyjson.com";
const TIMEOUT_MS = 15000; // batas tunggu per percobaan, supaya UI tidak "loading" tanpa batas
const MAX_RETRIES = 2; // percobaan ulang untuk error server sementara (bukan bug kita)
const RETRYABLE_STATUS = [502, 503, 504];

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Satu percobaan fetch dengan timeout, supaya request yang menggantung
// (server lambat merespons) tidak membuat UI loading selamanya.
async function fetchOnce(path, options) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      headers: { "Content-Type": "application/json" },
      ...options,
      signal: controller.signal,
    });
    return res;
  } finally {
    clearTimeout(timeoutId);
  }
}

// Helper generik: lempar Error yang jelas kalau response tidak ok,
// supaya UI bisa menampilkan status "gagal" dengan pesan yang berguna.
// DummyJSON adalah API publik gratis yang kadang membalas 502/503/504
// atau lambat merespons saat sedang banyak dipakai orang lain — bukan
// masalah di kode kita — jadi di sini kita coba ulang beberapa kali
// sebelum benar-benar menyerah dan menampilkan pesan gagal ke user.
async function request(path, options = {}) {
  let lastError;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const res = await fetchOnce(path, options);

      if (!res.ok) {
        let message = `Request gagal (status ${res.status})`;
        try {
          const body = await res.json();
          if (body?.message) message = body.message;
        } catch (e) {
          // ignore parse error, keep default message
        }

        if (RETRYABLE_STATUS.includes(res.status) && attempt < MAX_RETRIES) {
          lastError = new Error(message);
          await sleep(600 * (attempt + 1)); // backoff singkat sebelum coba lagi
          continue;
        }
        throw new Error(message);
      }

      return await res.json();
    } catch (err) {
      const isAbort = err.name === "AbortError";
      const isNetwork = err.message === "Network request failed";
      lastError = isAbort
        ? new Error("Server terlalu lama merespons. Periksa koneksi internet kamu dan coba lagi.")
        : err;

      if ((isAbort || isNetwork) && attempt < MAX_RETRIES) {
        await sleep(600 * (attempt + 1));
        continue;
      }
      throw lastError;
    }
  }

  throw lastError;
}

// ---------- AUTH (simulasi login/daftar via DummyJSON) ----------

export function loginUser(username, password) {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password, expiresInMins: 60 }),
  });
}

// DummyJSON /users/add tidak benar-benar menyimpan user baru (fake REST),
// tapi cukup untuk mensimulasikan alur "Daftar Akun" pada MVP ini.
export function registerUser({ firstName, lastName, email, username, password }) {
  return request("/users/add", {
    method: "POST",
    body: JSON.stringify({ firstName, lastName, email, username, password }),
  });
}

// ---------- PRODUCTS ----------

export function getProducts({ limit = 20, skip = 0 } = {}) {
  return request(`/products?limit=${limit}&skip=${skip}`);
}

export function searchProducts(query) {
  return request(`/products/search?q=${encodeURIComponent(query)}`);
}

export function getProductsByCategory(category) {
  return request(`/products/category/${encodeURIComponent(category)}`);
}

export function getCategories() {
  return request("/products/categories");
}

export function getProductById(id) {
  return request(`/products/${id}`);
}
