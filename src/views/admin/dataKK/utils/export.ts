// src/components/data-kk/utils/export.ts
import { KKItem } from "../types";
import { DAFTAR_BANTUAN } from "../constants/bantuan";

export const ExportToExcel = (filteredData: KKItem[]) => {
  if (filteredData.length === 0) return alert("Tidak ada data!");

  const headers = ["No KK", "Kepala Keluarga", "Alamat Lengkap", "RT", "RW", "Nomor Rumah", "Status Hunian", "Pemilik Rumah", "Kategori Kesejahteraan", "Jumlah Anggota KK", "Anggota Hidup", "Anggota Meninggal", "Penerima Bantuan", "Jenis Bantuan yang Diterima"];
  const rows = filteredData.map(kk => {
    const hidup = kk.anggota.filter(a => a.status === "Hidup").length;
    const penerima = kk.anggota.filter(a => a.bantuan && a.bantuan.length > 0).length;
    const daftarBantuan = [...new Set(kk.anggota.flatMap(a => a.bantuan || []))]
      .map(id => DAFTAR_BANTUAN.find(b => b.id === id)?.nama || id)
      .filter(Boolean).join("; ") || "Tidak ada";

    return [
      kk.noKK, kk.kepalaKeluarga, kk.alamatLengkap || kk.alamat, kk.rt, kk.rw, kk.noRumah || "",
      kk.statusHunian, kk.pemilikRumah || "", kk.kategoriKesejahteraan || "",
      kk.anggota.length, hidup, kk.anggota.length - hidup, penerima, daftarBantuan
    ];
  });

  const csvRows = [headers, ...rows].map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(";")).join("\r\n");
  const BOM = "\uFEFF";
  const blob = new Blob([BOM + csvRows], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `Data_KK_${new Date().toLocaleDateString("id-ID").replace(/\//g, "-")}.csv`;
  link.click();
  URL.revokeObjectURL(url);
};