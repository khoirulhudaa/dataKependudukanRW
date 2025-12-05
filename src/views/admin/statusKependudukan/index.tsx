// src/pages/admin/demografi/StatusKependudukan.tsx
import React, { useState } from "react";
import {
  MdAdd,
  MdError,
  MdFlight,
  MdHelpOutline,
  MdHome,
  MdPerson,
  MdRemove
} from "react-icons/md";

const StatusKependudukan: React.FC = () => {
  // === State Filter ===
  const [filterRT, setFilterRT] = useState<string>("all");
  const [filterGender, setFilterGender] = useState<string>("all");
  const [search, setSearch] = useState<string>("");

  // === Data Statis (nanti bisa diganti API + filtering real) ===
  const data = [
    { label: "Warga Tetap", count: 320, percent: 75, icon: MdPerson, color: "text-emerald-600", bg: "bg-emerald-500/10", ring: "ring-emerald-500/20" },
    { label: "Kontrak/Mengontrak", count: 80, percent: 13, icon: MdHome, color: "text-blue-600", bg: "bg-blue-500/10", ring: "ring-blue-500/20" },
    { label: "Kos/Mahasiswa", count: 45, percent: 8, icon: MdFlight, color: "text-indigo-600", bg: "bg-indigo-500/10", ring: "ring-indigo-500/20" },
    { label: "Perantau (Komunikatif)", count: 15, percent: 3, icon: MdFlight, color: "text-orange-600", bg: "bg-orange-500/10", ring: "ring-orange-500/20" },
    { label: "Perantau Tidak Diketahui", count: 5, percent: 1, icon: MdHelpOutline, color: "text-gray-500", bg: "bg-gray-500/10", ring: "ring-gray-500/20" },
    { label: "Pendatang Baru", count: 3, percent: 0.5, icon: MdAdd, color: "text-lime-600", bg: "bg-lime-500/10", ring: "ring-lime-500/20" },
    { label: "Pindah Keluar (6 bulan)", count: 2, percent: 0.3, icon: MdRemove, color: "text-rose-600", bg: "bg-rose-500/10", ring: "ring-rose-500/20" },
    { label: "Tidak Punya Dokumen", count: 8, percent: 1.2, icon: MdError, color: "text-red-600", bg: "bg-red-500/10", ring: "ring-red-500/20" },
  ];

  return (
    <div className="space-y-6">

      {/* ==================== FILTER SECTION ==================== */}
      <div className="bg-white dark:bg-slate-800/70 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700 mt-3">
        <h3 className="text-lg font-medium text-slate-700 dark:text-slate-300 mb-5">
          Filter Status Kependudukan
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-2 gap-4">
          {/* Filter RT */}
          <select
            value={filterRT}
            onChange={(e) => setFilterRT(e.target.value)}
            className="px-5 py-4 rounded-2xl bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-4 focus:ring-blue-500/30 text-base"
          >
            <option value="all">Semua RT</option>
            {["01", "02", "03", "04", "05", "06"].map((rt) => (
              <option key={rt} value={rt}>RT {rt}</option>
            ))}
          </select>

          {/* Filter Gender */}
          <select
            value={filterGender}
            onChange={(e) => setFilterGender(e.target.value)}
            className="px-5 py-4 rounded-2xl bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-4 focus:ring-blue-500/30 text-base"
          >
            <option value="all">Semua Gender</option>
            <option value="L">Laki-laki</option>
            <option value="P">Perempuan</option>
          </select>
        </div>
      </div>

      {/* ==================== KONTEN UTAMA ==================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Kolom Utama: Daftar Status (2/3) */}
        <div className="lg:col-span-2 space-y-5">
          {data.map((item) => (
            <div
              key={item.label}
              className="group flex items-center justify-between p-6 bg-white dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300"
            >
              {/* Kiri: Icon + Label */}
              <div className="flex items-center gap-5">
                <div className={`p-3 rounded-xl ${item.bg} ring-4 ${item.ring} backdrop-blur-xl`}>
                  <item.icon className={`w-7 h-7 ${item.color}`} />
                </div>
                <div>
                  <p className="text-lg font-medium text-slate-800 dark:text-white">{item.label}</p>
                  <p className="text-2xl font-medium text-slate-900 dark:text-white mt-1">{item.count}</p>
                </div>
              </div>

              {/* Kanan: Persentase + Bar */}
              <div className="text-right">
                <p className={`text-3xl font-medium ${item.color}`}>{item.percent}%</p>
                <div className="mt-2 w-32 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ease-out`}
                    style={{
                      width: `${item.percent}%`,
                      backgroundColor: item.color
                        .replace("text-", "#")
                        .replace("emerald-600", "#10b981")
                        .replace("blue-600", "#3b82f6")
                        .replace("indigo-600", "#6366f1")
                        .replace("orange-600", "#f97316")
                        .replace("gray-500", "#6b7280")
                        .replace("lime-600", "#84cc16")
                        .replace("rose-600", "#e11d48")
                        .replace("red-600", "#ef4444"),
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Kolom Kanan: Ringkasan Visual (1/3) */}
        <div className="space-y-6">
          <div className="p-8 bg-gradient-to-br text-white from-blue-600 to-blue-400 dark:from-blue-500/20 dark:to-blue-500/50 rounded-3xl border border-emerald-200 dark:border-emerald-800/50">
            <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">Dominan</p>
            <p className="text-4xl font-black text-emerald-600 dark:text-emerald-400 mt-2">75%</p>
            <p className="text-lg font-medium text-slate-700 dark:text-slate-300">Warga Tetap</p>
          </div>

          <div className="p-8 bg-gradient-to-br text-white from-blue-600 to-blue-400 dark:from-blue-500/20 dark:to-blue-500/50 rounded-3xl border border-orange-200 dark:border-orange-800/50">
            <p className="text-sm font-medium uppercase tracking-wider">Mobilitas Tinggi</p>
            <p className="text-4xl font-black mt-2">21%</p>
            <p className="text-lg font-medium text-white dark:text-white">Kontrak + Kos</p>
          </div>

          <div className="p-8 bg-gradient-to-br text-white from-blue-600 to-blue-400 dark:from-blue-500/20 dark:to-blue-500/50 rounded-3xl border border-red-300 dark:border-red-800/50">
            <p className="text-sm font-medium text-white dark:text-white uppercase tracking-wider">Perlu Perhatian</p>
            <p className="text-4xl font-black text-white dark:text-white mt-2">8</p>
            <p className="text-lg font-medium text-white dark:text-white">Tanpa Dokumen</p>
          </div>
        </div>
      </div>

      {/* Footer Insight */}
      <div className="p-6 bg-slate-100 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
          Mayoritas penduduk adalah <span className="font-medium text-emerald-600">warga tetap</span> dengan tingkat mobilitas sedang. 
          Fokus perhatian: <span className="font-medium text-red-600">8 warga tanpa dokumen</span> dan{" "}
          <span className="font-medium text-orange-600">5 perantau tak terlacak</span>.
        </p>
      </div>
    </div>
  );
};

export default StatusKependudukan;