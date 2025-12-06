// src/views/admin/kesehatan/KesehatanIbuAnak.tsx
import React, { useMemo, useState } from "react";
import { MdPregnantWoman, MdChildCare, MdWarning } from "react-icons/md";

const TRISEMESTER_OPTIONS = ["Trimester 1", "Trimester 2", "Trimester 3"] as const;
const STATUS_GIZI_OPTIONS = ["Gizi Baik", "Gizi Kurang", "Stunting"] as const;

type KK = {
  rt: string;
  rw: string;
  ibuHamil: typeof TRISEMESTER_OPTIONS[number] | null;
  ibuMenyusui: boolean;
  balita: number;
  statusGizi: typeof STATUS_GIZI_OPTIONS[number];
  aktifPosyandu: boolean;
};

const generateDummyData = (): KK[] =>
  Array.from({ length: 180 }, () => ({
    rt: String(Math.floor(Math.random() * 6) + 1).padStart(2, "0"),
    rw: String(Math.floor(Math.random() * 3) + 1).padStart(3, "0"),
    ibuHamil: Math.random() > 0.7 ? TRISEMESTER_OPTIONS[Math.floor(Math.random() * 3)] : null,
    ibuMenyusui: Math.random() > 0.6,
    balita: Math.floor(Math.random() * 3),
    statusGizi: STATUS_GIZI_OPTIONS[Math.floor(Math.random() * STATUS_GIZI_OPTIONS.length)],
    aktifPosyandu: Math.random() > 0.4,
  }));

const KesehatanIbuAnak: React.FC = () => {
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
    const ibuHamilCount = kkList.filter((kk) => kk.ibuHamil).length;
    const ibuMenyusuiCount = kkList.filter((kk) => kk.ibuMenyusui).length;
    const balitaTotal = kkList.reduce((acc, kk) => acc + kk.balita, 0);
    const stuntingCount = kkList.filter((kk) => kk.statusGizi === "Stunting").length;
    const aktifPosyanduCount = kkList.filter((kk) => kk.aktifPosyandu).length;

    const trimesterCounts = TRISEMESTER_OPTIONS.map((tri) => ({
      tri,
      count: kkList.filter((kk) => kk.ibuHamil === tri).length,
    }));

    const giziCounts = STATUS_GIZI_OPTIONS.map((gizi) => ({
      gizi,
      count: kkList.filter((kk) => kk.statusGizi === gizi).length,
    }));

    return {
      ibuHamil: ibuHamilCount,
      trimester: trimesterCounts,
      ibuMenyusui: ibuMenyusuiCount,
      balita: balitaTotal,
      gizi: giziCounts,
      aktifPosyandu: aktifPosyanduCount,
      total: kkList.length,
    };
  }, [kkList]);

  return (
    <div className="space-y-10 mt-4">
      {/* Header with Pink Gradient */}
      <div className="bg-gradient-to-r from-pink-500 to-pink-400 rounded-xl p-7 md:p-10 text-white shadow-2xl">
        <h1 className="text-2xl md:text-4xl font-bold flex items-center gap-4">
          <MdPregnantWoman className="text-5xl md:flex hidden" /> Program Ibu & Anak
        </h1>
        <p className="mt-3 text-lg text-pink-100">Pantau kesehatan ibu hamil, menyusui, dan balita untuk generasi sehat.</p>
      </div>

      {/* Filter Section */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 border border-pink-200 dark:border-pink-700">
        <h3 className="text-lg font-medium text-pink-700 dark:text-pink-300 mb-5">Filter Data</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <select
            value={filterRT}
            onChange={(e) => setFilterRT(e.target.value)}
            className="px-5 py-4 rounded-2xl bg-pink-50 dark:bg-pink-900/30 border border-pink-200 dark:border-pink-600 focus:ring-4 focus:ring-pink-500/30 text-base"
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
            className="px-5 py-4 rounded-2xl bg-pink-50 dark:bg-pink-900/30 border border-pink-200 dark:border-pink-600 focus:ring-4 focus:ring-pink-500/30 text-base"
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

      {/* Stat Cards - Horizontal Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: "Ibu Hamil", value: stats.ibuHamil, icon: <MdPregnantWoman className="w-8 h-8" />, gradient: "from-pink-400 to-pink-500" },
          { label: "Ibu Menyusui", value: stats.ibuMenyusui, icon: <MdChildCare className="w-8 h-8" />, gradient: "from-purple-400 to-pink-600" },
          { label: "Balita Stunting", value: stats.gizi.find(g => g.gizi === "Stunting")?.count || 0, icon: <MdWarning className="w-8 h-8" />, gradient: "from-red-400 to-orange-500" },
        ].map((item, idx) => (
          <div key={idx} className={`group relative overflow-hidden rounded-3xl bg-white dark:bg-slate-800 shadow-xl border border-pink-200 dark:border-pink-700`}>
            <div className={`h-2 bg-gradient-to-r ${item.gradient}`} />
            <div className="p-6 flex items-center gap-4">
              <div className={`p-3 rounded-full bg-gradient-to-br ${item.gradient} text-white`}>
                {item.icon}
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-800 dark:text-white">{item.value}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{item.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Trimester Breakdown */}
        <div className="bg-white rounded-3xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-black mb-6">Detail Ibu Hamil ({stats.ibuHamil})</h2>
          <div className="space-y-4">
            {stats.trimester.map((tri, i) => (
              <div key={i} className="flex justify-between items-center">
                <span className="text-gray-700 dark:text-gray-300">{tri.tri}</span>
                <span className="font-bold text-black">{tri.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Gizi Balita */}
        <div className="bg-white rounded-3xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-black mb-6">Status Gizi Balita ({stats.balita})</h2>
          <div className="space-y-4">
            {stats.gizi.map((gizi, i) => (
              <div key={i} className="flex justify-between items-center">
                <span className="text-gray-700 dark:text-gray-300">{gizi.gizi}</span>
                <span className="font-bold text-black">{gizi.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-medium text-pink-700 dark:text-pink-300 mb-5">Aksi Cepat</h3>
        <div className="flex flex-wrap gap-4">
          <button className="px-6 py-3 bg-pink-500 text-white rounded-full hover:bg-pink-600">Lihat Data Ibu Hamil</button>
          <button className="px-6 py-3 bg-pink-500 text-white rounded-full hover:bg-pink-600">Lihat Data Balita</button>
          <button className="px-6 py-3 bg-pink-500 text-white rounded-full hover:bg-pink-600">Download Laporan</button>
        </div>
      </div>
    </div>
  );
};

export default KesehatanIbuAnak;