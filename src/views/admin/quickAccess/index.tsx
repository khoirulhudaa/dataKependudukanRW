// src/views/admin/sosial-quick-access/index.tsx
import React, { useMemo, useState } from "react";
import {
  MdHome,
  MdMoneyOff,
  MdWarning,
  MdWorkOff,
} from "react-icons/md";

// -------------------------------------------------
// 1. Data Dummy (50 KK + anggota acak)
// -------------------------------------------------
const generateDummyKK = () => {
  const desilOptions = ["Pra Sejahtera", "Sejahtera I", "Sejahtera II", "Sejahtera III", "Sejahtera IV"];
  const pekerjaanOptions = ["Tidak Bekerja", "Difabel Tidak Bekerja", "Petani", "Buruh", "PNS", "Wiraswasta", "Ibu Rumah Tangga"];

  return Array.from({ length: 50 }, (_, i) => {
    const id = `KK${String(i + 1).padStart(3, "0")}`;
    const kategori = desilOptions[Math.floor(Math.random() * desilOptions.length)];
    const hunian = Math.random() > 0.75 ? "Rumah Tidak Layak Huni" : "Rumah Layak Huni";

    const jumlahAnggota = Math.floor(Math.random() * 6) + 1;
    const anggota = Array.from({ length: jumlahAnggota }, () => ({
      nama: `Anggota ${i + 1}-${Math.floor(Math.random() * 100)}`,
      pekerjaan: pekerjaanOptions[Math.floor(Math.random() * pekerjaanOptions.length)],
      bantuan: Math.random() > 0.7 ? ["PKH", "BPNT"] : [],
    }));

    return { id, kategoriKesejahteraan: kategori, statusHunian: hunian, anggota };
  });
};

// -------------------------------------------------
// 2. Komponen Utama (semua dalam 1 file)
// -------------------------------------------------
const QuickAccessPage: React.FC = () => {
  const [filterInfo, setFilterInfo] = useState<string>("Belum ada filter dipilih");

  // Data dummy
  const kkList = useMemo(() => generateDummyKK(), []);

  // Hitung statistik
  const stats = useMemo(() => {
    const sangatMiskin = kkList.filter(k =>
      ["Pra Sejahtera", "Sejahtera I"].includes(k.kategoriKesejahteraan)
    ).length;

    const miskin = kkList.filter(k => k.kategoriKesejahteraan === "Sejahtera II").length;

    const tidakBekerja = kkList
      .flatMap(k => k.anggota)
      .filter(a => a.pekerjaan === "Tidak Bekerja" || a.pekerjaan === "Difabel Tidak Bekerja").length;

    const rumahTidakLayak = kkList.filter(k => k.statusHunian === "Rumah Tidak Layak Huni").length;

    const miskinTanpaBantuan = kkList.filter(k => {
      const isMiskin = ["Pra Sejahtera", "Sejahtera I", "Sejahtera II"].includes(k.kategoriKesejahteraan);
      const adaBantuan = k.anggota.some((a: any) => a.bantuan.length > 0);
      return isMiskin && !adaBantuan;
    }).length;

    return { sangatMiskin, miskin, tidakBekerja, rumahTidakLayak, miskinTanpaBantuan };
  }, [kkList]);

  // Handler filter (bisa kamu ganti dengan filter tabel sesungguhnya nanti)
  const handleQuickFilter = (filter: string, value: any) => {
    console.log("Quick Filter →", { filter, value });
    setFilterInfo(`Filter aktif: ${filter} = ${JSON.stringify(value)}`);
  };

  const quickItems = [
    {
      icon: <MdMoneyOff className="w-9 h-9" />,
      label: "Sangat Miskin (Pra Sejahtera / Sejahtera I)",
      value: stats.sangatMiskin,
      color: "from-blue-500 to-blue-600",
      filter: () => handleQuickFilter("desil", ["Pra Sejahtera", "Sejahtera I"]),
    },
    {
      icon: <MdMoneyOff className="w-9 h-9" />,
      label: "Miskin (Sejahtera II)",
      value: stats.miskin,
      color: "from-orange-500 to-amber-600",
      filter: () => handleQuickFilter("desil", ["Sejahtera II"]),
    },
    {
      icon: <MdWorkOff className="w-9 h-9" />,
      label: "Tidak Bekerja",
      value: stats.tidakBekerja,
      color: "from-purple-500 to-indigo-600",
      filter: () => handleQuickFilter("pekerjaan", ["Tidak Bekerja", "Difabel Tidak Bekerja"]),
    },
    {
      icon: <MdHome className="w-9 h-9" />,
      label: "Rumah Tidak Layak Huni",
      value: stats.rumahTidakLayak,
      color: "from-green-500 to-green-600",
      filter: () => handleQuickFilter("hunian", "Rumah Tidak Layak Huni"),
    },
    {
      icon: <MdWarning className="w-9 h-9" />,
      label: "Miskin Tanpa Bantuan",
      value: stats.miskinTanpaBantuan,
      color: "from-red-600 to-pink-700",
      filter: () => handleQuickFilter("miskinTanpaBantuan", true),
    },
  ];

  return (
    <div className="min-h-screen mt-3">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div className="bg-white dark:bg-navy-800 rounded-2xl shadow-xl p-8">
          <h1 className="text-2xl md:text-4xl font-black text-gray-800 dark:text-white mb-3">
            Quick Access – Sosial Ekonomi
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Total KK: <strong>{kkList.length}</strong> (data dummy)
          </p>
          <div className="mt-4 p-4 bg-brand-50 dark:bg-brand-900/30 rounded-xl text-brand-700 dark:text-brand-300 font-medium">
            {filterInfo}
          </div>
        </div>

        {/* Banner */}
        <div className="bg-gradient-to-r from-brand-600 to-brand-800 rounded-2xl p-10 text-white">
          <h2 className="text-2xl md:text-4xl font-black mb-4">Quick Access</h2>
          <p className="text-xl text-brand-100">
            Klik kategori untuk langsung filter data yang paling sering dibutuhkan
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickItems.map((item, i) => (
            <button
              key={i}
              onClick={item.filter}
              className="group relative overflow-hidden rounded-2xl bg-white dark:bg-navy-800 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 p-8 text-left"
            >
              <div className="relative flex items-center gap-6">
                <div className={`p-5 rounded-2xl bg-gradient-to-br ${item.color} text-white shadow-lg`}>
                  {item.icon}
                </div>
                <div>
                  <p className="text-2xl md:text-4xl font-black text-gray-800 dark:text-white">
                    {item.value}
                  </p>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mt-2 leading-tight">
                    {item.label}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuickAccessPage;