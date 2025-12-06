// src/pages/admin/demografi/KelompokUsia.tsx
import React, { useState } from "react";
import {
    MdAccessibilityNew,
    MdChildCare,
    MdElderly,
    MdFemale,
    MdMale,
    MdMan,
    MdMan2,
    MdWork
} from "react-icons/md";

interface Kelompok {
  label: string;
  rentang: string;
  jumlah: number;
  persen: number;
  laki: number;
  perempuan: number;
  icon: React.ReactNode;
  gradient: string;
}

const dataKelompokUsia: Kelompok[] = [
  { label: "Balita", rentang: "0–4 tahun", jumlah: 48, persen: 10.0, laki: 25, perempuan: 23, icon: <MdChildCare className="w-9 h-9" />, gradient: "from-pink-400/20 via-rose-400/20 to-red-400/10" },
  { label: "Anak-anak", rentang: "5–12 tahun", jumlah: 92, persen: 19.2, laki: 47, perempuan: 45, icon: <MdMan className="w-9 h-9" />, gradient: "from-amber-400/20 via-orange-400/20 to-yellow-400/10" },
  { label: "Remaja", rentang: "13–17 tahun", jumlah: 68, persen: 14.2, laki: 36, perempuan: 32, icon: <MdAccessibilityNew className="w-9 h-9" />, gradient: "from-orange-400/20 via-red-400/20 to-rose-400/10" },
  { label: "Dewasa", rentang: "18–59 tahun", jumlah: 162, persen: 33.9, laki: 82, perempuan: 80, icon: <MdWork className="w-9 h-9" />, gradient: "from-blue-500/20 via-indigo-500/20 to-purple-500/10" },
  { label: "Lansia", rentang: "60+ tahun", jumlah: 20, persen: 4.2, laki: 9, perempuan: 11, icon: <MdElderly className="w-9 h-9" />, gradient: "from-purple-500/20 via-violet-500/20 to-fuchsia-500/10" },
];

const totalPenduduk = 300;

const KelompokUsia: React.FC = () => {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className="space-y-12 mt-3">

      <div className="col-span-1 md:col-span-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl p-8 text-white shadow-2xl">
        <h2 className="text-3xl md:text-4xl font-black mb-2">Kelompok Usia Penduduk</h2>
        <p className="text-blue-100 text-lg">Data seluruh anggota keluarga (KK)</p>
        <div className="mt-6 flex items-baseline gap-3">
          <span className="text-5xl font-black">{totalPenduduk}</span>
          <span className="text-xl opacity-90">jiwa</span>
        </div>
      </div>

      {/* Ringkasan Stats – Glass Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Usia Produktif", value: "250 orang", sub: "18–59 tahun", gradient: "from-blue-500 to-indigo-600" },
          { label: "Anak & Remaja", value: "208 orang", sub: "0–17 tahun", gradient: "from-orange-500 to-red-600" },
          { label: "Dependency Ratio", value: "83.2%", sub: "Rasio ketergantungan", gradient: "from-emerald-500 to-teal-600" },
          { label: "Rata-rata Usia", value: "32.4 tahun", sub: "Usia median", gradient: "from-purple-500 to-pink-600" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="group relative p-8 bg-white/60 dark:bg-slate-800/60 backdrop-blur-2xl rounded-3xl border border-white/40 dark:border-slate-700/50 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <p className="text-sm w-max flex font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">{stat.label}</p>
            <p className={`mt-3 text-2xl font-black bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
              {stat.value}
            </p>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Daftar Kelompok – Card Premium */}
      <div className="space-y-10">
        {dataKelompokUsia.map((kel, index) => (
            <div
            key={kel.label}
            className={`
                group relative overflow-hidden rounded-3xl
                bg-white/70 dark:bg-slate-800/70
                backdrop-blur-xl border border-white/50 dark:border-slate-700/50
                shadow-lg hover:shadow-2xl transition-all duration-500
                ${index === 0 ? "" : "mt-8"}
            `}
            >
            {/* Gradient Accent Line (soft) */}
            <div className={`absolute top-0 left-0 h-1.5 w-full bg-gradient-to-r ${kel.gradient} opacity-70`} />

            <div className="p-8 lg:p-10">
                <div className="grid lg:grid-cols-12 gap-8 md:items-center">
                {/* Kolom 1: Icon + Label */}
                <div className="lg:col-span-3 flex items-center gap-6">
                    <div className="p-5 bg-white/50 dark:bg-white/10 backdrop-blur-xl rounded-3xl shadow-xl border border-white/60">
                    {kel.icon}
                    </div>
                    <div>
                    <h3 className="text-xl w-max font-black text-slate-800 dark:text-white leading-tight">
                        {kel.label}
                    </h3>
                    <p className="text-base font-medium text-slate-600 dark:text-slate-400">
                        {kel.rentang}
                    </p>
                    </div>
                </div>

                {/* Kolom 2: Total Jiwa */}
                <div className="border border-gray-100 rounded-lg flex p-4 justify-between cols-span-1 md:col-span-2 md:text-center">
                    <p className="text-2xl font-black text-slate-800 dark:text-white">
                    {kel.jumlah}
                    </p>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">
                    jiwa
                    </p>
                </div>

                {/* Kolom 3: Persentase */}
                <div className="border border-gray-100 rounded-lg flex p-4 justify-between lg:col-span-2 md:text-center">
                    <p className="text-2xl font-black text-slate-800 dark:text-white">
                    {kel.persen.toFixed(1)}%
                    </p>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">
                    dari total
                    </p>
                </div>
                
                <div className="border border-gray-100 rounded-lg flex p-4 justify-between lg:col-span-2 md:text-center">
                    <p className="text-2xl font-black text-slate-800 dark:text-white">
                    {kel.laki} 
                    </p>
                    <p className="text-sm flex items-center gap-2 font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">
                    <MdMale className="w-5 h-5 text-blue-600" /> Laki-Laki
                    </p>
                </div>

                <div className="border border-gray-100 rounded-lg flex p-4 justify-between lg:col-span-2 md:text-center">
                    <p className="text-2xl font-black text-slate-800 dark:text-white">
                    {kel.perempuan}
                    </p>
                    <p className="text-sm flex items-center gap-2 font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">
                    <MdFemale className="w-5 h-5 text-blue-600" /> Perempuan
                    </p>
                </div>

                </div>

                {/* Progress Bar di Bawah */}
                <div className="mt-8 h-3 bg-purple-200 border border-purple-800 dark:bg-slate-700/50 rounded-full overflow-hidden relative">
                <div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${kel.persen}%` }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                </div>
            </div>
            </div>
        ))}
    </div>
      {/* Piramida Penduduk – Elegant Version */}
      <div className="relative overflow-hidden rounded-3xl bg-white p-8 md:pb-10 md:p-12 backdrop-blur-xl border border-white/40 dark:border-slate-700/50 shadow-2xl">
        <h3 className="text-2xl w-max md:text-3xl font-black text-slate-800 dark:text-white mb-10">Struktur Piramida Penduduk</h3>
        
        <div className="md:flex md:items-end md:justify-center md:space-y-0 space-y-14 gap-16">
          {/* Laki-laki (kiri) */}
          <div className="w-full md:w-1/2 space-y-6">
            {dataKelompokUsia.map((k) => (
              <div key={k.label} className="w-full flex items-center gap-4">
                <span className="w-max text-sm font-medium text-slate-600 dark:text-slate-400 md:text-right">{k.rentang}</span>
                <div
                  className="h-4 bg-gradient-to-r from-white md:from-indigo-600 to-indigo-600 md:to-indigo-500 rounded-full md:rounded-l-full transition-all duration-700"
                  style={{ width: `${(k.laki / 85) * 220}px` }}
                />
                <span className="w-10 text-sm font-medium text-slate-700 dark:text-white">{k.laki}</span>
              </div>
            ))}
          </div>

          {/* Perempuan (kanan) */}
          <div className="w-full md:w-1/2 md:block hidden space-y-6">
            {dataKelompokUsia.map((k) => (
              <div key={k.label} className="w-full flex items-center gap-4">
                <span className="w-10 text-sm font-medium text-slate-700 dark:text-white">{k.perempuan}</span>
                <div
                  className="h-4 bg-gradient-to-l from-pink-600 to-white md:to-pink-500 rounded-full md:rounded-r-full transition-all duration-700"
                  style={{ width: `${(k.perempuan / 85) * 220}px` }}
                />
                <span className="w-24 text-sm font-medium text-slate-600 dark:text-slate-400">{k.rentang}</span>
              </div>
            ))}
          </div>

          {/* Perempuan (kanan) MOBILE */}
          <div className="space-y-6 md:hidden">
            {dataKelompokUsia.map((k) => (
              <div key={k.label} className="w-full flex items-center gap-4">
                <span className="w-24 text-sm font-medium text-slate-600 dark:text-slate-400">{k.rentang}</span>
                <div
                  className="h-4 bg-gradient-to-l from-pink-600 to-white rounded-full md:rounded-r-full transition-all duration-700"
                  style={{ width: `${(k.perempuan / 85) * 220}px` }}
                />
                <span className="w-10 text-sm font-medium text-slate-700 dark:text-white">{k.perempuan}</span>
              </div>
            ))}
          </div>

        </div>
          <div className="mt-10 w-full border-t border-t-gray-100 pt-9 flex items-center gap-5">
            <div className="w-max flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-blue-500">

                </div>
                <p>Laki-laki</p>
            </div>
            <div className="w-max flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-pink-500">

                </div>
                <p>Perempuan</p>
            </div>
          </div>
      </div>
    </div>
  );
};

export default KelompokUsia;