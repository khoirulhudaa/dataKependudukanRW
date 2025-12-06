// src/views/admin/kesehatan/KesehatanMenular.tsx
import React, { useMemo, useState } from "react";
import { BsVirus } from "react-icons/bs";
import { MdLocalHospital, MdMasks, MdWarning } from "react-icons/md";

const JENIS_MENULAR_OPTIONS = ["TB", "Dengue", "Malaria", "COVID-19", "Lainnya"] as const;
const STATUS_OPTIONS = ["Aktif", "Sembuh", "Isolasi"] as const;

type KK = {
  rt: string;
  rw: string;
  menular: typeof JENIS_MENULAR_OPTIONS[number];
  status: typeof STATUS_OPTIONS[number];
  vaksin: boolean;
};

const generateDummyData = (): KK[] =>
  Array.from({ length: 100 }, () => ({
    rt: String(Math.floor(Math.random() * 6) + 1).padStart(2, "0"),
    rw: String(Math.floor(Math.random() * 3) + 1).padStart(3, "0"),
    menular: JENIS_MENULAR_OPTIONS[Math.floor(Math.random() * JENIS_MENULAR_OPTIONS.length)],
    status: STATUS_OPTIONS[Math.floor(Math.random() * STATUS_OPTIONS.length)],
    vaksin: Math.random() > 0.7,
  }));

const KesehatanMenular: React.FC = () => {
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
    const jenisCounts = JENIS_MENULAR_OPTIONS.map((jenis) => ({
      jenis,
      count: kkList.filter((kk) => kk.menular === jenis).length,
    }));
    const aktifCount = kkList.filter((kk) => kk.status === "Aktif").length;
    const vaksinCount = kkList.filter((kk) => kk.vaksin).length;

    return {
      jenis: jenisCounts,
      aktif: aktifCount,
      vaksin: vaksinCount,
      total: kkList.length,
    };
  }, [kkList]);

  return (
    <div className="space-y-10 mt-4">
      {/* Header with Orange Gradient */}
      <div className="bg-gradient-to-r from-orange-500 to-yellow-600 rounded-xl p-7 md:p-10 text-white shadow-2xl">
        <h1 className="text-2xl md:text-4xl font-bold flex items-center gap-4">
          <BsVirus className="text-5xl md:flex hidden" /> Penyakit Menular
        </h1>
        <p className="mt-3 text-lg text-orange-100">Cegah penyebaran dengan deteksi dini dan vaksinasi.</p>
      </div>

      {/* Filter Section */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 border border-orange-200 dark:border-orange-700">
        <h3 className="text-lg font-medium text-orange-700 dark:text-orange-300 mb-5">Filter Data</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <select
            value={filterRT}
            onChange={(e) => setFilterRT(e.target.value)}
            className="px-5 py-4 rounded-2xl bg-orange-50 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-600 focus:ring-4 focus:ring-orange-500/30 text-base"
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
            className="px-5 py-4 rounded-2xl bg-orange-50 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-600 focus:ring-4 focus:ring-orange-500/30 text-base"
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

      {/* Stat Cards - Alert Style with Badges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: "Total Kasus", value: stats.total, icon: <MdMasks className="w-8 h-8" />, gradient: "from-orange-400 to-yellow-500" },
          { label: "Kasus Aktif", value: stats.aktif, icon: <MdWarning className="w-8 h-8" />, gradient: "from-red-400 to-red-600" },
          { label: "Sudah Vaksin", value: stats.vaksin, icon: <MdLocalHospital className="w-8 h-8" />, gradient: "from-green-400 to-green-600" },
        ].map((item, idx) => (
          <div key={idx} className={`group relative overflow-hidden rounded-3xl bg-white dark:bg-slate-800 shadow-xl border border-orange-200 dark:border-orange-700`}>
            <div className={`h-2 bg-gradient-to-r ${item.gradient}`} />
            <div className="p-6 relative">
              <span className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-xs">Alert</span>
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-full bg-gradient-to-br ${item.gradient} text-white`}>
                  {item.icon}
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-800 dark:text-white">{item.value}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{item.label}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Jenis Menular Breakdown */}
      <div className="bg-white rounded-3xl p-8 shadow-lg">
        <h2 className="text-2xl font-bold text-black dark:text-black mb-6">Jenis Penyakit Menular</h2>
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
        <h3 className="text-lg font-medium text-orange-700 dark:text-orange-300 mb-5">Aksi Cepat</h3>
        <div className="flex flex-wrap gap-4">
          <button className="px-6 py-3 bg-orange-500 text-white rounded-full hover:bg-orange-600">Lihat Data Menular</button>
          <button className="px-6 py-3 bg-orange-500 text-white rounded-full hover:bg-orange-600">Koordinasi Vaksin</button>
          <button className="px-6 py-3 bg-orange-500 text-white rounded-full hover:bg-orange-600">Download Laporan</button>
        </div>
      </div>
    </div>
  );
};

export default KesehatanMenular;