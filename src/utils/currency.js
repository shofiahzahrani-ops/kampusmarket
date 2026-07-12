// Util konversi & format harga ke Rupiah.
// DummyJSON mengembalikan harga produk dalam USD, jadi di sini kita
// konversi memakai kurs simulasi lalu format ala "Rp 1.234.000".

export const USD_TO_IDR_RATE = 15750;

export function toRupiahAmount(usdPrice) {
  const amount = Number(usdPrice) || 0;
  return Math.round(amount * USD_TO_IDR_RATE);
}

export function formatRupiah(usdPrice) {
  const idr = toRupiahAmount(usdPrice);
  return `Rp${idr.toLocaleString("id-ID")}`;
}
