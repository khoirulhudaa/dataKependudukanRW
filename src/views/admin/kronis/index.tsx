// src/views/admin/kesehatan/KesehatanKronis.tsx
import React, { useMemo, useState } from "react";
import { MdFavoriteBorder, MdBloodtype, MdLocalHospital, MdWarning } from "react-icons/md";

const JENIS_KRONIS_OPTIONS = ["Hipertensi", "Diabetes", "Jantung", "Kanker", "Lainnya"] as const;

type KK = {
  rt: string;
  rw: string;
  kronis: typeof JENIS_KRONIS_OPTIONS[number];
  obatRutin: boolean;
  kontrolDokter: boolean;
};

const generateDummyData = (): KK[] =>
  Array.from({ length: 150 }, () => ({
    rt: String(Math.floor(Math.random() * 6) + 1).padStart(2, "0"),
    rw: String(Math.floor(Math.random() * 3) + 1).padStart(3, "0"),
    kronis: JENIS_KRONIS_OPTIONS[Math.floor(Math.random() * JENIS_KRONIS_OPTIONS.length)],
    obatRutin: Math.random() > 0.6,
    kontrolDokter: Math.random() > 0.5,
  }));

const KesehatanKronis: React.FC = () => {
  const rawData = useMemo(() => generateDummyData(), []);
  const [filterRT, setFilterRT] = useState<string>("all");
  const [filterRW, setFilterRW] = useState<string>("all");

  const kkList = useMemo(() => {
    return rawData.filter((kk) => {
      if (filterRT !== "all" && kk.rt !== filterRT) return false;
      if (filterRW !== "all" && kk.rw !== filterRW) return false;
      return true;
    });
  }, [rawData, filterRT, filterRW]);

  const stats = useMemo(() => {
    const jenisCounts = JENIS_KRONIS_OPTIONS.map((jenis) => ({
      jenis,
      count: kkList.filter((kk) => kk.kronis === jenis).length,
    }));
    const obatRutin = kkList.filter((kk) => kk.obatRutin).length;
    const kontrolDokter = kkList.filter((kk) => kk.kontrolDokter).length;

    return {
      jenis: jenisCounts,
      obatRutin,
      kontrolDokter,
      total: kkList.length,
    };
  }, [kkList]);

  return (
    <div className="space-y-10 mt-4">
      {/* Header with Maroon Gradient */}
      <div className="bg-gradient-to-r from-red-800 to-gray-900 rounded-xl p-7 md:p-10 text-white shadow-2xl">
        <h1 className="text-2xl md:text-4xl font-bold flex items-center gap-4">
          <MdLocalHospital className="text-5xl md:flex hidden" /> Penyakit Kronis
        </h1>
        <p className="mt-3 text-lg text-red-100">Kelola penyakit kronis dengan monitoring ketat dan pengobatan rutin.</p>
      </div>

      {/* Filter Section */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 border border-red-200 dark:border-red-700">
        <h3 className="text-lg font-medium text-red-700 dark:text-red-300 mb-5">Filter Data</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <select
            value={filterRT}
            onChange={(e) => setFilterRT(e.target.value)}
            className="px-5 py-4 rounded-2xl bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-600 focus:ring-4 focus:ring-red-500/30 text-base"
          >
            <option value="all">Semua RT</option>
            {["01", "02", "03", "04", "05", "06"].map((rt) => (
              <option key={rt} value={rt}>
                RT {rt}
              </option>
            ))}
          </select>
          <select
            value={filterRW}
            onChange={(e) => setFilterRW(e.target.value)}
            className="px-5 py-4 rounded-2xl bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-600 focus:ring-4 focus:ring-red-500/30 text-base"
          >
            <option value="all">Semua RW</option>
            {["001", "002", "003"].map((rw) => (
              <option key={rw} value={rw}>
                RW {rw}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Stat Cards - Dark Theme with Borders */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: "Total Kasus", value: stats.total, icon: <MdFavoriteBorder className="w-8 h-8" />, gradient: "from-red-700 to-gray-800" },
          { label: "Obat Rutin", value: stats.obatRutin, icon: <MdBloodtype className="w-8 h-8" />, gradient: "from-amber-700 to-orange-800" },
          { label: "Kontrol Dokter", value: stats.kontrolDokter, icon: <MdWarning className="w-8 h-8" />, gradient: "from-green-700 to-green-800" },
        ].map((item, idx) => (
          <div key={idx} className={`group relative overflow-hidden rounded-3xl bg-white text-black shadow-xl border border-red-500`}>
            <div className={`h-2 bg-gradient-to-r ${item.gradient}`} />
            <div className="p-6 flex flex-col items-center">
              <div className={`mb-4 p-3 rounded-full text-white bg-gradient-to-br ${item.gradient}`}>
                {item.icon}
              </div>
              <p className="text-3xl font-bold">{item.value}</p>
              <p className="text-sm opacity-80">{item.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Jenis Kronis Table */}
      <div className="bg-white rounded-3xl p-8 shadow-lg">
        <h2 className="text-2xl font-bold text-black dark:text-black mb-6">Jenis Penyakit Kronis</h2>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="pb-2">Jenis</th>
              <th className="pb-2">Jumlah</th>
            </tr>
          </thead>
          <tbody>
            {stats.jenis.map((jenis, i) => (
              <tr key={i} className="border-b">
                <td className="py-2 text-gray-700 dark:text-gray-300">{jenis.jenis}</td>
                <td className="py-2 font-bold text-black">{jenis.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-medium text-red-700 dark:text-red-300 mb-5">Aksi Cepat</h3>
        <div className="flex flex-wrap gap-4">
          <button className="px-6 py-3 bg-red-500 text-white rounded-full hover:bg-red-600">Lihat Data Kronis</button>
          <button className="px-6 py-3 bg-red-500 text-white rounded-full hover:bg-red-600">Atur Pengobatan</button>
          <button className="px-6 py-3 bg-red-500 text-white rounded-full hover:bg-red-600">Download Laporan</button>
        </div>
      </div>
    </div>
  );
};

export default KesehatanKronis;