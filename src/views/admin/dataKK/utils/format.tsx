// src/components/data-kk/utils/format.ts
import { MdChildCare, MdSchool, MdAccessibilityNew, MdElderly, MdWarning } from "react-icons/md";

export const hitungUsia = (tanggalLahir: string): number => {
  if (!tanggalLahir) return 0;
  const birth = new Date(tanggalLahir);
  const today = new Date();
  if (isNaN(birth.getTime())) return 0;
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age < 0 ? 0 : age;
};

export const formatTanggal = (dateString: string): string => {
  if (!dateString) return "—";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric" }).format(date);
};

export const kelompokUsia = (usia: number) => {
  if (usia < 1) return { nama: "Bayi", icon: <MdChildCare className="h-4 w-4" />, color: "text-pink-600" };
  if (usia < 6) return { nama: "Balita", icon: <MdChildCare className="h-4 w-4" />, color: "text-pink-500" };
  if (usia < 13) return { nama: "Anak-anak", icon: <MdChildCare className="h-4 w-4" />, color: "text-blue-600" };
  if (usia < 18) return { nama: "Remaja", icon: <MdSchool className="h-4 w-4" />, color: "text-green-600" };
  if (usia < 56) return { nama: "Usia Produktif", icon: <MdAccessibilityNew className="h-4 w-4" />, color: "text-indigo-600" };
  if (usia < 70) return { nama: "Lansia", icon: <MdElderly className="h-4 w-4" />, color: "text-yellow-700" };
  return { nama: "Lansia Risiko Tinggi", icon: <MdWarning className="h-4 w-4" />, color: "text-red-700" };
};