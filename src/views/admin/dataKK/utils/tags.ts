// src/components/data-kk/utils/tags.ts
import { DAFTAR_BANTUAN } from "../constants/bantuan";
import { kelompokUsia, hitungUsia } from "./format";

export const renderTagsAnggota = (anggota: any, usia: number = 0) => {
  const tags: { label: string; color: string }[] = [];

  const kelompok = kelompokUsia(usia);
  tags.push({ label: kelompok.nama, color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" });

  if (anggota.pekerjaan) {
    tags.push({ label: anggota.pekerjaan, color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200" });
  }
  if (anggota.statusKeluarga === "Istri") {
    tags.push({ label: "Ibu Rumah Tangga", color: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200" });
  }
  anggota.bantuan?.forEach((id: string) => {
    const b = DAFTAR_BANTUAN.find(x => x.id === id);
    if (b) tags.push({ label: `Penerima ${b.nama}`, color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200" });
  });
  if (anggota.statusKesehatan && anggota.statusKesehatan !== "Sehat") {
    tags.push({ label: anggota.statusKesehatan, color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200" });
  }
  if (anggota.kelengkapanArsipRT?.includes("KTP")) {
    tags.push({ label: "KTP", color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" });
  }
  if (usia >= 17 && !anggota.kelengkapanArsipRT?.includes("KTP")) {
    tags.push({ label: "Belum KTP", color: "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300" });
  }

  return tags;
};