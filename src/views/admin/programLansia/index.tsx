// src/views/admin/kesehatan/KesehatanLansia.tsx
import React, { useMemo, useState } from "react";
import { MdElderly, MdFavorite, MdLocalHospital, MdWarning } from "react-icons/md";

const PENYAKIT_OPTIONS = ["Hipertensi", "Diabetes", "Jantung", "Sehat"] as const;

type KK = {
  rt: string;
  rw: string;
  lansia: number;
  penyakit: typeof PENYAKIT_OPTIONS[number];
  cekRutin: boolean;
  aktifPosbindu: boolean;
};

const generateDummyData = (): KK[] =>
  Array.from({ length: 120 }, () => ({
    rt: String(Math.floor(Math.random() * 6) + 1).padStart(2, "0"),
    rw: String(Math.floor(Math.random() * 3) + 1).padStart(3, "0"),
    lansia: Math.floor(Math.random() * 2) + 1,
    penyakit: PENYAKIT_OPTIONS[Math.floor(Math.random() * PENYAKIT_OPTIONS.length)],
    cekRutin: Math.random() > 0.5,
    aktifPosbindu: Math.random() > 0.4,
  }));

const KesehatanLansia: React.FC = () => {
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
    const totalLansia = kkList.reduce((acc, kk) => acc + kk.lansia, 0);
    const penyakitCounts = PENYAKIT_OPTIONS.map((pen) => ({
      pen,
      count: kkList.filter((kk) => kk.penyakit === pen).length,
    }));
    const cekRutinCount = kkList.filter((kk) => kk.cekRutin).length;
    const aktifPosbinduCount = kkList.filter((kk) => kk.aktifPosbindu).length;

    return {
      totalLansia,
      penyakit: penyakitCounts,
      cekRutin: cekRutinCount,
      aktifPosbindu: aktifPosbinduCount,
      total: kkList.length,
    };
  }, [kkList]);

  return (
    <div className="space-y-10 mt-4">
      {/* Header with Green Gradient */}
      <div className="bg-gradient-to-r from-teal-700 to-teal-600 rounded-xl p-7 md:p-10 text-white shadow-2xl">
        <h1 className="text-2xl md:text-4xl font-bold flex items-center gap-4">
          <MdElderly className="text-5xl md:flex hidden" /> Program Lansia
        </h1>
        <p className="mt-3 text-lg text-emerald-100">Dukung kesehatan lansia dengan pemantauan rutin dan pencegahan.</p>
      </div>

      {/* Filter Section */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 border border-emerald-200 dark:border-emerald-700">
        <h3 className="text-lg font-medium text-emerald-700 dark:text-emerald-300 mb-5">Filter Data</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <select
            value={filterRT}
            onChange={(e) => setFilterRT(e.target.value)}
            className="px-5 py-4 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-600 focus:ring-4 focus:ring-emerald-500/30 text-base"
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
            className="px-5 py-4 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-600 focus:ring-4 focus:ring-emerald-500/30 text-base"
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

      {/* Stat Cards - Vertical Stack with Icons on Top */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {[
          { label: "Total Lansia", value: stats.totalLansia, icon: <MdElderly className="w-10 h-10" />, gradient: "from-teal-500 to-teal-400" },
          { label: "Hipertensi", value: stats.penyakit.find(p => p.pen === "Hipertensi")?.count || 0, icon: <MdFavorite className="w-10 h-10" />, gradient: "from-red-400 to-red-600" },
          { label: "Diabetes", value: stats.penyakit.find(p => p.pen === "Diabetes")?.count || 0, icon: <MdLocalHospital className="w-10 h-10" />, gradient: "from-amber-400 to-orange-500" },
          { label: "Cek Rutin", value: stats.cekRutin, icon: <MdWarning className="w-10 h-10" />, gradient: "from-green-400 to-green-600" },
        ].map((item, idx) => (
          <div key={idx} className={`relative overflow-hidden rounded-xl bg-white dark:bg-slate-800 shadow-xl border border-emerald-200 dark:border-emerald-700`}>
            <div className={`h-2 bg-gradient-to-r ${item.gradient}`} />
            <div className="p-6 text-center">
              <div className={`mx-auto mb-4 p-4 rounded-full bg-gradient-to-br ${item.gradient} text-white w-fit`}>
                {item.icon}
              </div>
              <p className="text-3xl font-bold text-gray-800 dark:text-white">{item.value}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{item.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Penyakit Breakdown */}
      <div className="bg-white dark:bg-white rounded-xl p-8 shadow-lg">
        <h2 className="text-2xl font-bold text-emerald-800 dark:text-emerald-200 mb-6">Detail Penyakit Lansia</h2>
        <div className="space-y-4">
          {stats.penyakit.map((pen, i) => (
            <div key={i} className="flex justify-between items-center">
              <span className="text-gray-700 dark:text-gray-300">{pen.pen}</span>
              <span className="font-bold text-emerald-600">{pen.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-medium text-emerald-700 dark:text-emerald-300 mb-5">Aksi Cepat</h3>
        <div className="flex flex-wrap gap-4">
          <button className="px-6 py-3 bg-teal-500 text-white rounded-full hover:bg-teal-600">Lihat Data Lansia</button>
          <button className="px-6 py-3 bg-teal-500 text-white rounded-full hover:bg-teal-600">Jadwalkan Cek Rutin</button>
          <button className="px-6 py-3 bg-teal-500 text-white rounded-full hover:bg-teal-600">Download Laporan</button>
        </div>
      </div>
    </div>
  );
};

export default KesehatanLansia;