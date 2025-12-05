// src/components/data-kk/constants/bantuan.ts
export const DAFTAR_BANTUAN = [
  { id: "pkh", nama: "PKH", color: "bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300" },
  { id: "bpnt", nama: "BPNT / Sembako", color: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300" },
  { id: "blt-dd", nama: "BLT Dana Desa", color: "bg-purple-100 text-purple-700" },
  { id: "blt-umkm", nama: "BLT UMKM (BPUM)", color: "bg-orange-100 text-orange-700" },
  { id: "bsu", nama: "BSU / Subsidi Gaji", color: "bg-yellow-100 text-yellow-700" },
  { id: "kip", nama: "KIP (Siswa)", color: "bg-green-100 text-green-700" },
  { id: "kis", nama: "KIS / JKN PBI", color: "bg-teal-100 text-teal-700" },
  { id: "prakerja", nama: "Kartu Prakerja", color: "bg-indigo-100 text-indigo-700" },
  { id: "rutilahu", nama: "Rutilahu / Bedah Rumah", color: "bg-red-100 text-red-700" },
  { id: "non-bansos", nama: "Penerima Non-Bansos", color: "bg-gray-100 text-gray-700 dark:bg-gray-800" },
] as const;

export const KERENTANAN_SOSIAL = [
  "Yatim", "Piatu", "Yatim Piatu", "Janda", "Duda",
  "Korban PHK", "Korban Bencana", "Komorbid Serius", "Terlantar"
] as const;