// src/views/admin/sosial-ekonomi/KondisiRumah.tsx
import React, { useMemo, useState } from "react";
import {
  MdFence,
  MdLightbulb,
  MdOutlineBathroom,
  MdRoofing,
  MdTexture,
  MdWaterDrop,
} from "react-icons/md";

// Ganti tipe manual yang terlalu ketat dengan tipe yang di-infer otomatis
const LANTAI_OPTIONS = ["Tanah", "Semen", "Ubin/Tegel", "Keramik"] as const;
const DINDING_OPTIONS = ["Bambu", "Kayu", "Tembok/Bata"] as const;
const ATAP_OPTIONS = ["Daun/Seng", "Asbes", "Genteng", "Beton"] as const;
const AIR_OPTIONS = ["Sungai", "Sumur Gali", "Sumur Bor/Pompa", "PDAM"] as const;
const SANITASI_OPTIONS = ["Tidak Ada", "Jamban Umum", "Jamban Sendiri", "Jamban + Septic Tank"] as const;
const LISTRIK_OPTIONS = ["Tidak Ada", "450VA", "900VA", "1300VA+"] as const;

// Sekarang tipe otomatis jadi literal type yang benar
type Lantai = typeof LANTAI_OPTIONS[number];
type Dinding = typeof DINDING_OPTIONS[number];
type Atap = typeof ATAP_OPTIONS[number];
type Air = typeof AIR_OPTIONS[number];
type Sanitasi = typeof SANITASI_OPTIONS[number];
type Listrik = typeof LISTRIK_OPTIONS[number];

type KK = {
  rt: string;
  rw: string;
  kondisiRumah: {
    lantai: Lantai;
    dinding: Dinding;
    atap: Atap;
    air: Air;
    sanitasi: Sanitasi;
    listrik: Listrik;
  };
};

// ----------------------------------------------------
// Dummy data yang sekarang punya RT & RW
// ----------------------------------------------------
const generateDummyData = (): KK[] =>
  
  Array.from({ length: 200 }, () => ({
    rt: String(Math.floor(Math.random() * 6) + 1).padStart(2, "0"),
    rw: String(Math.floor(Math.random() * 3) + 1).padStart(3, "0"),
    kondisiRumah: {
      lantai: LANTAI_OPTIONS[Math.floor(Math.random() * LANTAI_OPTIONS.length)] as Lantai,
      dinding: DINDING_OPTIONS[Math.floor(Math.random() * DINDING_OPTIONS.length)] as Dinding,
      atap: ATAP_OPTIONS[Math.floor(Math.random() * ATAP_OPTIONS.length)] as Atap,
      air: AIR_OPTIONS[Math.floor(Math.random() * AIR_OPTIONS.length)] as Air,
      sanitasi: SANITASI_OPTIONS[Math.floor(Math.random() * SANITASI_OPTIONS.length)] as Sanitasi,
      listrik: LISTRIK_OPTIONS[Math.floor(Math.random() * LISTRIK_OPTIONS.length)] as Listrik,
    },
  }));

const categories = [
  // ... (tetap sama seperti kode asli)
  { key: "lantai" as const, label: "Lantai", icon: <MdTexture className="w-7 h-7" />, gradient: "from-blue-400 to-blue-500" },
  { key: "dinding" as const, label: "Dinding", icon: <MdFence className="w-7 h-7" />, gradient: "from-purple-400 to-purple-600" },
  { key: "atap" as const, label: "Atap", icon: <MdRoofing className="w-7 h-7" />, gradient: "from-red-400 to-red-600" },
  { key: "air" as const, label: "Sumber Air", icon: <MdWaterDrop className="w-7 h-7" />, gradient: "from-orange-400 to-orange-600" },
  { key: "sanitasi" as const, label: "Sanitasi", icon: <MdOutlineBathroom className="w-7 h-7" />, gradient: "from-green-400 to-green-600" },
  { key: "listrik" as const, label: "Listrik", icon: <MdLightbulb className="w-7 h-7" />, gradient: "from-yellow-400 to-orange-500" },
] as const;

const KondisiRumah: React.FC = () => {
  const rawData = useMemo(() => generateDummyData(), []);

  // ------------------- STATE FILTER -------------------
  const [filterRT, setFilterRT] = useState<string>("all");
  const [filterRW, setFilterRW] = useState<string>("all");

  // ------------------- DATA YANG SUDAH DIFILTER -------------------
  const kkList = useMemo(() => {
    return rawData.filter((kk) => {
      if (filterRT !== "all" && kk.rt !== filterRT) return false;
      if (filterRW !== "all" && kk.rw !== filterRW) return false;
      return true;
    });
  }, [rawData, filterRT, filterRW]);

  // ------------------- STATISTIK (sama seperti sebelumnya) -------------------
  const stats = useMemo(() => {
    return categories.map((cat) => {
      const countMap = kkList.reduce((acc, kk) => {
        const val = kk.kondisiRumah[cat.key];
        acc[val] = (acc[val] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const sorted = Object.entries(countMap)
        .sort(([, a], [, b]) => b - a)
        .map(([kondisi, jumlah]) => ({
          kondisi,
          jumlah,
          persen: (jumlah / kkList.length) * 100,
        }));

      return { ...cat, items: sorted, total: kkList.length };
    });
  }, [kkList]);

  // ----------------------------------------------------
  return (
    <div className="space-y-12 mt-3">
      {/* ==================== FILTER ==================== */}
      <div className="bg-white dark:bg-slate-800/70 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
        <h3 className="text-lg font-medium text-slate-700 dark:text-slate-300 mb-5">
          Filter Kondisi Rumah
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
          {/* Filter RT */}
          <select
            value={filterRT}
            onChange={(e) => setFilterRT(e.target.value)}
            className="px-5 py-4 rounded-2xl bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-4 focus:ring-blue-500/30 text-base"
          >
            <option value="all">Semua RT</option>
            {["01", "02", "03", "04", "05", "06"].map((rt) => (
              <option key={rt} value={rt}>
                RT {rt}
              </option>
            ))}
          </select>

          {/* Filter RW */}
          <select
            value={filterRW}
            onChange={(e) => setFilterRW(e.target.value)}
            className="px-5 py-4 rounded-2xl bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-4 focus:ring-blue-500/30 text-base"
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

      {/* ==================== GRID KARTU (tetap sama) ==================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {stats.map((cat, idx) => (
          <div
            key={idx}
            className="group relative overflow-hidden rounded-3xl bg-white dark:bg-navy-800/90 shadow-xl backdrop-blur-xl border border-gray-200/50 dark:border-white/10 transition-all hover:shadow-2xl hover:-translate-y-2"
          >
            {/* Gradient Top Bar */}
            <div className={`h-2 bg-gradient-to-r ${cat.gradient}`} />

            <div className="p-8">
              {/* Icon + Label */}
              <div className="flex items-center gap-5 mb-6">
                <div className={`p-4 rounded-2xl bg-gradient-to-br ${cat.gradient} text-white shadow-lg`}>
                  {cat.icon}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{cat.label}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total {cat.total} KK</p>
                </div>
              </div>

              {/* List Kondisi */}
              <div className="space-y-4">
                {cat.items.map((item, i) => {
                  const isGood =
                    i === 0 &&
                    !item.kondisi.includes("Tidak") &&
                    !item.kondisi.includes("Semen") &&
                    !item.kondisi.includes("Bambu");
                  const isBad =
                    item.kondisi.includes("Tidak Ada") ||
                    item.kondisi.includes("Sungai") ||
                    item.kondisi.includes("Tanah");

                  return (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex-1 flex items-center gap-3">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            isGood ? "bg-green-500" : isBad ? "bg-red-500" : "bg-amber-500"
                          }`}
                        />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                          {item.kondisi}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 ml-4">
                        <span className="text-lg font-bold text-gray-800 dark:text-white">
                          {item.jumlah}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          ({item.persen.toFixed(0)}%)
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Progress Bar Summary */}
              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-white/10">
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
                  <span>Kondisi Terbaik</span>
                  <span>{cat.items[0]?.jumlah || 0} KK</span>
                </div>
                <div className="w-full h-3 bg-gray-200 dark:bg-navy-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${cat.gradient} transition-all duration-1000`}
                    style={{ width: `${cat.items[0]?.persen || 0}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          </div>
        ))}
      </div>

      {/* ==================== RINGKASAN CEPAT (juga ikut ter-filter) ==================== */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: "Rumah dengan Keramik", value: kkList.filter((k) => k.kondisiRumah.lantai === "Keramik").length, color: "from-amber-400 to-yellow-500" },
          { label: "Air dari PDAM", value: kkList.filter((k) => k.kondisiRumah.air === "PDAM").length, color: "from-cyan-400 to-blue-600" },
          { label: "Jamban + Septic Tank", value: kkList.filter((k) => k.kondisiRumah.sanitasi === "Jamban + Septic Tank").length, color: "from-green-400 to-green-600" },
          { label: "Listrik 1300VA+", value: kkList.filter((k) => k.kondisiRumah.listrik === "1300VA+").length, color: "from-yellow-400 to-orange-500" },
        ].map((item, i) => (
          <div
            key={i}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-gray-50 dark:from-navy-800 dark:to-navy-900 p-6 shadow-lg border border-gray-200/50 dark:border-white/10"
          >
            <div className="relative">
              <p className="text-4xl font-black text-gray-800 dark:text-white">{item.value}</p>
              <p className="mt-2 text-sm font-medium text-gray-600 dark:text-gray-400">{item.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KondisiRumah;