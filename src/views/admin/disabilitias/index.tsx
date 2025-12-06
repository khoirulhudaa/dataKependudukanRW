// src/views/admin/kesehatan/KesehatanDisabilitas.tsx
import React, { useMemo, useState } from "react";
import { MdAccessibility, MdWheelchairPickup, MdWarning, MdLocalHospital } from "react-icons/md";

const JENIS_DISABILITAS_OPTIONS = ["Fisik", "Sensorik", "Intelektual", "Mental"] as const;
const BANTUAN_OPTIONS = ["Ya", "Tidak"] as const;

type KK = {
  rt: string;
  rw: string;
  disabilitas: typeof JENIS_DISABILITAS_OPTIONS[number];
  bantuan: typeof BANTUAN_OPTIONS[number];
  aksesLayanan: boolean;
};

const generateDummyData = (): KK[] =>
  Array.from({ length: 80 }, () => ({
    rt: String(Math.floor(Math.random() * 6) + 1).padStart(2, "0"),
    rw: String(Math.floor(Math.random() * 3) + 1).padStart(3, "0"),
    disabilitas: JENIS_DISABILITAS_OPTIONS[Math.floor(Math.random() * JENIS_DISABILITAS_OPTIONS.length)],
    bantuan: BANTUAN_OPTIONS[Math.floor(Math.random() * BANTUAN_OPTIONS.length)],
    aksesLayanan: Math.random() > 0.5,
  }));

const KesehatanDisabilitas: React.FC = () => {
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
    const jenisCounts = JENIS_DISABILITAS_OPTIONS.map((jenis) => ({
      jenis,
      count: kkList.filter((kk) => kk.disabilitas === jenis).length,
    }));
    const bantuanYa = kkList.filter((kk) => kk.bantuan === "Ya").length;
    const aksesLayanan = kkList.filter((kk) => kk.aksesLayanan).length;

    return {
      jenis: jenisCounts,
      bantuanYa,
      aksesLayanan,
      total: kkList.length,
    };
  }, [kkList]);

  return (
    <div className="space-y-10 mt-4">
      {/* Header with Indigo Gradient */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-7 md:p-10 text-white shadow-2xl">
        <h1 className="text-2xl md:text-4xl font-bold flex items-center gap-4">
          <MdAccessibility className="text-5xl md:flex hidden" /> Program Disabilitas
        </h1>
        <p className="mt-3 text-lg text-indigo-100">Pastikan aksesibilitas dan bantuan untuk penyandang disabilitas.</p>
      </div>

      {/* Filter Section */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 border border-indigo-200 dark:border-indigo-700">
        <h3 className="text-lg font-medium text-indigo-700 dark:text-indigo-300 mb-5">Filter Data</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <select
            value={filterRT}
            onChange={(e) => setFilterRT(e.target.value)}
            className="px-5 py-4 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-600 focus:ring-4 focus:ring-indigo-500/30 text-base"
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
            className="px-5 py-4 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-600 focus:ring-4 focus:ring-indigo-500/30 text-base"
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

      {/* Stat Cards - Grid with Progress Bars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: "Total Kasus", value: stats.total, icon: <MdWheelchairPickup className="w-8 h-8" />, gradient: "from-indigo-400 to-purple-500" },
          { label: "Dapat Bantuan", value: stats.bantuanYa, icon: <MdLocalHospital className="w-8 h-8" />, gradient: "from-green-400 to-green-600" },
          { label: "Akses Layanan", value: stats.aksesLayanan, icon: <MdWarning className="w-8 h-8" />, gradient: "from-amber-400 to-orange-500" },
        ].map((item, idx) => (
          <div key={idx} className={`group relative overflow-hidden rounded-3xl bg-white dark:bg-slate-800 shadow-xl border border-indigo-200 dark:border-indigo-700`}>
            <div className={`h-2 bg-gradient-to-r ${item.gradient}`} />
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className={`p-3 rounded-full bg-gradient-to-br ${item.gradient} text-white`}>
                  {item.icon}
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-800 dark:text-white">{item.value}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{item.label}</p>
                </div>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full">
                <div className={`h-full rounded-full bg-gradient-to-r ${item.gradient}`} style={{ width: `${(item.value / stats.total) * 100}%` }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Jenis Disabilitas Breakdown */}
      <div className="bg-white rounded-3xl p-8 shadow-lg">
        <h2 className="text-2xl font-bold text-black dark:text-black mb-6">Jenis Disabilitas</h2>
        <div className="space-y-4">
          {stats.jenis.map((jenis, i) => (
            <div key={i} className="flex justify-between items-center">
              <span className="text-gray-700 dark:text-gray-300">{jenis.jenis}</span>
              <span className="font-bold text-black">{jenis.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-medium text-indigo-700 dark:text-indigo-300 mb-5">Aksi Cepat</h3>
        <div className="flex flex-wrap gap-4">
          <button className="px-6 py-3 bg-indigo-500 text-white rounded-full hover:bg-indigo-600">Lihat Data Disabilitas</button>
          <button className="px-6 py-3 bg-indigo-500 text-white rounded-full hover:bg-indigo-600">Koordinasi Bantuan</button>
          <button className="px-6 py-3 bg-indigo-500 text-white rounded-full hover:bg-indigo-600">Download Laporan</button>
        </div>
      </div>
    </div>
  );
};

export default KesehatanDisabilitas;