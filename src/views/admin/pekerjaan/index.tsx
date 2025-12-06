// src/views/admin/sosial-ekonomi/Pekerjaan.tsx
import React, { useMemo } from "react";
import { MdPeople, MdPersonOff, MdTrendingUp, MdWorkOutline } from "react-icons/md";

const pekerjaanList = [
  "Tidak Bekerja",
  "Difabel Tidak Bekerja",
  "Ibu Rumah Tangga",
  "Petani",
  "Buruh",
  "PNS",
  "Wirausaha",
  "Ojek Online",
  "Pelajar",
  "Karyawan Swasta",
] as const;

const generateDummy = () =>
  Array.from({ length: 220 }, () => ({
    anggota: Array.from({ length: Math.floor(Math.random() * 6) + 2 }, () => ({
      pekerjaan: pekerjaanList[Math.floor(Math.random() * pekerjaanList.length)],
    })),
  }));

const Pekerjaan: React.FC = () => {
  const kkList = useMemo(() => generateDummy(), []);

  const data = useMemo(() => {
    const map = new Map<string, number>();
    kkList.forEach((kk) =>
      kk.anggota.forEach((a) =>
        map.set(a.pekerjaan, (map.get(a.pekerjaan) || 0) + 1)
      )
    );

    const total = Array.from(map.values()).reduce((a, b) => a + b, 0);

    return Array.from(map)
      .map(([name, value]) => ({
        name,
        value,
        persen: Number(((value / total) * 100).toFixed(1)),
      }))
      .sort((a, b) => b.value - a.value);
  }, [kkList]);

  const totalPenduduk = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <>
      {/* Background sama persis */}
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="max-w-7xl mx-auto py-3">

          {/* Header Elegan */}
          <div className="text-left mb-6">
            <div className="inline-flex items-center gap-3 bg-indigo-500/20 dark:bg-indigo-500/10 px-6 py-3 rounded-full mb-6">
              <MdWorkOutline className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
              <span className="text-lg font-medium text-indigo-700 dark:text-indigo-300">
                Statistik Ketenagakerjaan
              </span>
            </div>
            <p className="mt-2.5 text-xl text-slate-600 dark:text-slate-400 max-w-3xl">
              Total penduduk tercatat:{" "}
              <strong className="text-2xl text-indigo-600 dark:text-indigo-400 font-bold">
                {totalPenduduk}
              </strong>{" "}
              jiwa
            </p>
          </div>

          {/* Grid Card Utama */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">

            {/* Card Total Penduduk */}
            <div className="relative bg-white/70 dark:bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/30 dark:border-white/10 shadow-xl">
              <div className="w-max p-5 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-lg mb-6">
                <MdPeople className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-medium text-slate-800 dark:text-white mb-2">
                Total Penduduk
              </h3>
              <p className="text-2xl md:text-5xl font-black text-slate-900 dark:text-white">
                {totalPenduduk}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">Jiwa</p>
            </div>

            {/* Card Pekerja Aktif (contoh insight) */}
            <div className="relative bg-white/70 dark:bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/30 dark:border-white/10 shadow-xl">
              <div className="w-max p-5 rounded-2xl bg-gradient-to-br from-green-500 to-teal-600 text-white shadow-lg mb-6">
                <MdTrendingUp className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-medium text-slate-800 dark:text-white mb-2">
                Bekerja / Produktif
              </h3>
              <p className="text-2xl md:text-5xl font-black text-slate-900 dark:text-white">
                {data.slice(3).reduce((a, b) => a + b.value, 0)}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">Orang</p>
            </div>

            {/* Card Pengangguran */}
            <div className="relative bg-white/70 dark:bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/30 dark:border-white/10 shadow-xl">
                <div className="w-max p-5 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 text-white shadow-lg mb-6">
                <MdPersonOff className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-medium text-slate-800 dark:text-white mb-2">
                Tidak Bekerja
                </h3>
                <p className="text-2xl md:text-5xl font-black text-slate-900 dark:text-white">
                {data.find(d => d.name === "Tidak Bekerja")?.value || 0}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">Orang</p>
            </div>

          </div>

        {/* Chart Utama - Donut Chart Modern & Menyamping */}
        <div className="dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-700">
        <div className="mb-10 text-left">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Distribusi Pekerjaan Penduduk
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 mt-2">
            Total penduduk: <span className="font-bold text-indigo-600 dark:text-indigo-400 text-2xl">{totalPenduduk}</span> jiwa
            </p>
        </div>

        <div className="space-y-6">
            {data.map((item, index) => {
            // Semakin tinggi ranking → font lebih besar & bold, shadow lebih dalam
            const shadowIntensity = index === 0 ? "shadow-md" : index === 1 ? "shadow-md" : index === 2 ? "shadow-md" : "shadow-md";

            return (
                <div
                key={item.name}
                className={`bg-white dark:bg-slate-800/50 rounded-2xl p-7 border-2 transition-all duration-300 hover:scale-[1.02] hover:border-indigo-300 dark:hover:border-indigo-600 ${shadowIntensity} ${
                    index <= 2 ? "border-indigo-500" : "border-slate-200 dark:border-slate-700"
                }`}
                >
                <div className="flex items-center justify-between">
                    {/* Kiri: Ranking + Nama + Jumlah */}
                    <div className="flex items-center gap-6">
                    {/* Badge Ranking */}
                    <div
                        className={`flex h-16 w-16 items-center justify-center rounded-full text-2xl font-black text-white shadow-lgb bg-gradient-to-r from-blue-500 to-blue-600 `}
                    >
                        {index + 1}
                    </div>

                    <div>
                        <h3 className={`text-lg font-medium text-slate-900 dark:text-white`}>
                        {item.name}
                        </h3>
                        <p className={`text-lg font-black text-slate-900 dark:text-white leading-tight`}>
                        {item.value} <span className="text-lg text-slate-600">orang</span>
                        </p>
                    </div>
                    </div>

                    {/* Kanan: Persentase */}
                    <div className="text-right">
                    <div className="text-lg font-black text-slate-900 dark:text-white">
                        {item.persen}%
                    </div>
                    <div className="text-sm font-medium text-slate-500 dark:text-slate-400">
                        dari total
                    </div>
                    </div>
                </div>

                {/* Progress bar tipis di bawah (semakin tebal untuk ranking atas) */}
                <div className="mt-6 h-4 bg-blue-200 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
                    <div
                    className={`h-full rounded-full transition-all duration-1000 bg-gradient-to-r from-blue-600 to-blue-400`}
                    style={{ width: `${item.persen}%` }}
                    />
                </div>
                </div>
            );
            })}
        </div>
        </div>

        </div>
      </div>
    </>
  );
};

export default Pekerjaan;