// src/pages/admin/demografi/JenisKelaminAgama.tsx
import React, { useState } from "react";
import { MdFemale, MdMale, MdOutlineCircle, MdSearch } from "react-icons/md";

const JenisKelaminAgama: React.FC = () => {
  // === State untuk Filter ===
  const [filterRT, setFilterRT] = useState<string>("all");
  const [filterGender, setFilterGender] = useState<string>("all");
  const [filterUsia, setFilterUsia] = useState<string>("all");
  const [search, setSearch] = useState<string>("");

  // === Data Statis (nanti bisa diganti dengan API) ===
  const total = 478;
  const laki = 248;
  const perempuan = 230;
  const ratio = ((laki / total) * 100).toFixed(1);
const ratioNum = parseFloat(ratio); // konversi sekali di atas
const perempuanRatioNum = Number((100 - ratioNum).toFixed(1));
  const agamaData = [
    { name: "Islam", count: 412, percent: 86.2, color: "text-emerald-600", bg: "bg-emerald-500/10", ring: "ring-emerald-500/20" },
    { name: "Kristen", count: 35, percent: 7.3, color: "text-blue-600", bg: "bg-blue-500/10", ring: "ring-blue-500/20" },
    { name: "Katolik", count: 18, percent: 3.8, color: "text-indigo-600", bg: "bg-indigo-500/10", ring: "ring-indigo-500/20" },
    { name: "Hindu", count: 8, percent: 1.7, color: "text-orange-600", bg: "bg-orange-500/10", ring: "ring-orange-500/20" },
    { name: "Buddha", count: 4, percent: 0.8, color: "text-yellow-600", bg: "bg-yellow-500/10", ring: "ring-yellow-500/20" },
    { name: "Lainnya", count: 1, percent: 0.2, color: "text-gray-500", bg: "bg-gray-500/10", ring: "ring-gray-500/20" },
  ];

  return (
    <div className="space-y-6 mt-3">

      {/* ==================== FILTER SECTION ==================== */}
      <div className="bg-white dark:bg-slate-800/70 backdrop-blur-sm rounded-xl shadow-lg p-6 mt-2.5 border border-slate-200 dark:border-slate-700">
        <h3 className="text-lg font-medium text-slate-700 dark:text-slate-300 mb-5">Filter Data Penduduk</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari Nama / NIK / No. KK"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 transition-all text-base"
            />
          </div>

          {/* Filter RT */}
          <select
            value={filterRT}
            onChange={(e) => setFilterRT(e.target.value)}
            className="px-5 py-4 rounded-2xl bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-4 focus:ring-blue-500/30 text-base"
          >
            <option value="all">Semua RT</option>
            {["01", "02", "03", "04", "05"].map((rt) => (
              <option key={rt} value={rt}>
                RT {rt}
              </option>
            ))}
          </select>

          {/* Filter Jenis Kelamin */}
          <select
            value={filterGender}
            onChange={(e) => setFilterGender(e.target.value)}
            className="px-5 py-4 rounded-2xl bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-4 focus:ring-blue-500/30 text-base"
          >
            <option value="all">Semua Gender</option>
            <option value="L">Laki-laki</option>
            <option value="P">Perempuan</option>
          </select>

          {/* Filter Usia */}
          <select
            value={filterUsia}
            onChange={(e) => setFilterUsia(e.target.value)}
            className="px-5 py-4 rounded-2xl bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-4 focus:ring-blue-500/30 text-base"
          >
            <option value="all">Semua Usia</option>
            <option value="0-17">0-17 tahun</option>
            <option value="18-59">18-59 tahun</option>
            <option value="60+">60+ tahun</option>
          </select>
        </div>
      </div>

      {/* ==================== KONTEN UTAMA ==================== */}
      <div className="grid grid-cols-1 lg:grid-cols-1">

        {/* Kolom Kiri: Gender Ratio (2/3) */}
        <div className="lg:col-span-2 space-y-10">

          {/* Gender Bar Modern */}
         <div className="p-8 pb-10 bg-white dark:bg-slate-800/50 backdrop-blur-sm rounded-3xl border border-slate-200 dark:border-slate-700">
            <h2 className="text-xl font-medium text-slate-700 dark:text-slate-300 mb-8">
                Rasio Jenis Kelamin
            </h2>

            <div className="space-y-7">
                {/* Laki-laki */}
                <div className="flex items-center gap-5">
                <MdMale className="w-12 h-12 text-blue-600 flex-shrink-0" />
                <div className="flex-1">
                    <div className="flex items-baseline justify-between mb-2">
                    <p className="text-2xl font-medium text-blue-600">{ratio}%</p>
                    </div>

                    {/* Progress bar dengan label di dalam */}
                    <div className="relative bg-blue-100 h-10 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                        className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full transition-all duration-1000 flex items-center justify-center"
                        style={{ width: `${ratio}%` }}
                    >
                        {/* Label hanya muncul kalau bar cukup lebar (minimal ~15%) */}
                        <span className="text-white flex items-center gap-3 font-medium text-md drop-shadow-md">
                            <p className="text-lg font-black text-slate-800 dark:text-white">{laki}</p>
                            Laki-laki
                        </span>
                    </div>
                    </div>
                </div>
                </div>

                {/* Perempuan */}
                <div className="flex items-center gap-5">
                <MdFemale className="w-12 h-12 text-pink-600 flex-shrink-0" />
                <div className="flex-1">
                    <div className="flex items-baseline justify-between mb-2">
                    <p className="text-2xl font-medium text-pink-600">{(100 - parseFloat(ratio)).toFixed(1)}%</p>
                    </div>

                    <div className="relative bg-pink-100 h-10 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                        className="absolute inset-0 bg-gradient-to-r from-pink-600 to-pink-400 rounded-full transition-all duration-1000 flex items-center justify-center"
                        style={{ width: `${100 - parseFloat(ratio)}%` }}
                    >
                        {/* Label hanya muncul kalau cukup lebar */}
                        <span className="text-white flex items-center gap-3 font-medium text-md drop-shadow-md">
                            <p className="text-lg font-black text-slate-800 dark:text-white">{perempuan}</p>
                            Perempuan 
                        </span>
                    </div>
                    </div>
                </div>
                </div>
            </div>
            </div>

          {/* Sex Ratio Insight */}
          <div className="p-6 bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Sex Ratio</p>
            <p className="text-3xl font-black text-slate-800 dark:text-white mt-1">
              {(laki / perempuan * 100).toFixed(0)} ♂ : 100 ♀
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {laki > perempuan ? "Lebih banyak laki-laki" : "Lebih banyak perempuan"}
            </p>
          </div>

          {/* Summary Boxes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Mayoritas Agama</p>
              <p className="text-2xl font-black text-emerald-600 mt-1">Islam (86.2%)</p>
            </div>
            <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Rasio Kelamin</p>
              <p className="text-2xl font-black text-indigo-600 mt-1">108 : 100</p>
            </div>
            <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Minoritas</p>
              <p className="text-2xl font-black text-orange-600 mt-1">Hindu &amp; Buddha</p>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Daftar Agama */}
        <div className="gap-7 w-full grid grid-cols-1 md:grid-cols-3 mt-10">
          {agamaData.map((item) => (
            <div
              key={item.name}
              className="group w-full flex items-center justify-between p-7 bg-white dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300"
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${item.bg} ring-4 ${item.ring}`}>
                  <MdOutlineCircle className={`w-6 h-6 ${item.color}`} />
                </div>
                <div>
                  <p className="font-medium text-slate-800 dark:text-white">{item.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{item.percent}%</p>
                </div>
              </div>
              <p className="text-2xl font-medium text-slate-900 dark:text-white">{item.count}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JenisKelaminAgama;